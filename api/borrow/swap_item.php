<?php
// Endpoint untuk memproses penukaran barang (Swap).

$borrowal_id = $_POST['borrowal_id'] ?? null;
$new_item_id = $_POST['new_item_id'] ?? null;
$swap_quantity = isset($_POST['swap_quantity']) ? (int)$_POST['swap_quantity'] : 0;
$condition = $_POST['condition'] ?? 'good'; // 'good' atau 'bad'
$remark = $_POST['remark'] ?? null;

if (!$borrowal_id || !$new_item_id) {
    json_response('error', 'Data penukaran tidak lengkap.');
}

if ($swap_quantity < 1) {
    json_response('error', 'Jumlah penukaran minimal 1.');
}

if ($condition === 'bad' && empty($remark)) {
    json_response('error', 'Harap isi kendala/penyebab kerusakan barang.');
}

try {
    $pdo->beginTransaction();

    // Ambil data peminjaman saat ini (Barang Lama) & Kunci baris
    $stmt = $pdo->prepare("SELECT * FROM borrowals WHERE id = ? FOR UPDATE");
    $stmt->execute([$borrowal_id]);
    $current_borrowal = $stmt->fetch();

    if (!$current_borrowal) {
        throw new Exception("Data peminjaman tidak ditemukan.");
    }

    // Validasi jumlah yang ditukar tidak boleh melebihi yang dipinjam
    if ($swap_quantity > $current_borrowal['quantity']) {
        throw new Exception("Jumlah yang ditukar melebihi jumlah yang dipinjam.");
    }

    $old_item_id = $current_borrowal['item_id'];
    
    // Cek stok barang pengganti
    $stmt_new_item = $pdo->prepare("SELECT current_quantity FROM items WHERE id = ? FOR UPDATE");
    $stmt_new_item->execute([$new_item_id]);
    $new_item_stock = $stmt_new_item->fetchColumn();

    if ($new_item_stock === false) {
        throw new Exception("Barang pengganti tidak ditemukan.");
    }
    
    if ($swap_quantity > $new_item_stock) {
        throw new Exception("Stok barang pengganti tidak mencukupi.");
    }

    // Proses Pencatatan History (Barang LAMA yang dikembalikan/rusak)
    $sql_history = "INSERT INTO history (
        borrowal_id, transaction_id, item_id, quantity, 
        borrower_name, borrower_class, subject, borrow_date, 
        return_date, item_condition, condition_remark, user_id, 
        is_swap, swap_new_item_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, 1, ?)";
    
    $stmt_history = $pdo->prepare($sql_history);
    $stmt_history->execute([
        $current_borrowal['id'], 
        $current_borrowal['transaction_id'], 
        $old_item_id, 
        $swap_quantity, 
        $current_borrowal['borrower_name'], 
        $current_borrowal['borrower_class'],
        $current_borrowal['subject'], 
        $current_borrowal['borrow_date'],
        $condition, 
        $remark,
        $current_borrowal['user_id'],
        $new_item_id
    ]);

    // --- PERBAIKAN LOGIKA PENGGABUNGAN ---
    
    if ($old_item_id == $new_item_id) {
        $stmt_reset = $pdo->prepare("UPDATE borrowals SET item_condition = 'good', condition_remark = NULL WHERE id = ?");
        $stmt_reset->execute([$borrowal_id]);
        
    } else {
        $stmt_restore_stock = $pdo->prepare("UPDATE items SET current_quantity = current_quantity + ? WHERE id = ?");
        $stmt_restore_stock->execute([$swap_quantity, $old_item_id]);

        // Kurangi stok barang baru
        $stmt_deduct_stock = $pdo->prepare("UPDATE items SET current_quantity = current_quantity - ? WHERE id = ?");
        $stmt_deduct_stock->execute([$swap_quantity, $new_item_id]);

        $stmt_check_existing = $pdo->prepare("SELECT id, quantity FROM borrowals WHERE transaction_id = ? AND item_id = ? AND id != ?");
        $stmt_check_existing->execute([$current_borrowal['transaction_id'], $new_item_id, $borrowal_id]);
        $existing_target_item = $stmt_check_existing->fetch();

        // Full Swap (Tukar Semua)
        if ($swap_quantity == $current_borrowal['quantity']) {
            if ($existing_target_item) {
                // Merge ke barang yang sudah ada
                $new_quantity = $existing_target_item['quantity'] + $swap_quantity;
                $stmt_merge = $pdo->prepare("UPDATE borrowals SET quantity = ? WHERE id = ?");
                $stmt_merge->execute([$new_quantity, $existing_target_item['id']]);

                // Hapus baris lama
                $stmt_delete_old = $pdo->prepare("DELETE FROM borrowals WHERE id = ?");
                $stmt_delete_old->execute([$borrowal_id]);
            } else {
                // Ubah item_id di baris yang sama
                $stmt_update_borrowal = $pdo->prepare("UPDATE borrowals SET item_id = ?, item_condition = 'good', condition_remark = NULL WHERE id = ?");
                $stmt_update_borrowal->execute([$new_item_id, $borrowal_id]);
            }
        } 
        else {
            // Kurangi jumlah di baris lama
            $remaining_qty = $current_borrowal['quantity'] - $swap_quantity;
            $stmt_reduce_old = $pdo->prepare("UPDATE borrowals SET quantity = ? WHERE id = ?");
            $stmt_reduce_old->execute([$remaining_qty, $borrowal_id]);

            // Tambahkan/Merge baris baru
            if ($existing_target_item) {
                $new_total_qty = $existing_target_item['quantity'] + $swap_quantity;
                $stmt_merge = $pdo->prepare("UPDATE borrowals SET quantity = ? WHERE id = ?");
                $stmt_merge->execute([$new_total_qty, $existing_target_item['id']]);
            } else {
                $sql_insert_new = "INSERT INTO borrowals (
                    transaction_id, item_id, quantity, borrower_name, 
                    borrower_class, subject, borrow_date, user_id, item_condition
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'good')";
                
                $stmt_insert_new = $pdo->prepare($sql_insert_new);
                $stmt_insert_new->execute([
                    $current_borrowal['transaction_id'],
                    $new_item_id,
                    $swap_quantity,
                    $current_borrowal['borrower_name'],
                    $current_borrowal['borrower_class'],
                    $current_borrowal['subject'],
                    $current_borrowal['borrow_date'],
                    $current_borrowal['user_id']
                ]);
            }
        }
    }

    $pdo->commit();
    json_response('success', 'Barang berhasil ditukar.');

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Swap Item Error: ' . $e->getMessage());
    json_response('error', $e->getMessage());
}