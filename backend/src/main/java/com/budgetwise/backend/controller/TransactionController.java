package com.budgetwise.backend.controller;

import com.budgetwise.backend.model.Transaction;
import com.budgetwise.backend.repository.TransactionRepository;
import com.budgetwise.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private TransactionRepository transactionRepository;

    // ✅ 1. Add a new transaction
    @PostMapping("/add")
    public ResponseEntity<String> addTransaction(@RequestBody Transaction transaction) {
        transactionService.saveTransaction(transaction);
        return ResponseEntity.ok("Transaction added successfully!");
    }

    // ✅ 2. Get all transactions by user ID
    @GetMapping("/list/{userId}")
    public List<Transaction> getTransactionsByUser(@PathVariable Long userId) {
        return transactionService.getTransactionsByUser(userId);
    }

    // ✅ 3. Get a single transaction by ID
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        Optional<Transaction> transaction = transactionRepository.findById(id);
        return transaction.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ 4. Update a transaction by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction updatedTransaction) {

        Optional<Transaction> existing = transactionRepository.findById(id);
        if (existing.isPresent()) {
            Transaction transaction = existing.get();

            transaction.setAmount(updatedTransaction.getAmount());
            transaction.setCategory(updatedTransaction.getCategory());
            transaction.setTitle(updatedTransaction.getTitle());
            transaction.setDescription(updatedTransaction.getDescription());
            transaction.setAccount(updatedTransaction.getAccount());
            transaction.setType(updatedTransaction.getType());
            transaction.setDate(updatedTransaction.getDate());
            transaction.setUserId(updatedTransaction.getUserId());

            transactionRepository.save(transaction);
            return ResponseEntity.ok("Transaction updated successfully!");
        } else {
            return ResponseEntity.status(404).body("Transaction not found!");
        }
    }

    // ✅ 5. Delete a transaction by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable Long id) {
        boolean deleted = transactionService.deleteTransaction(id);
        if (deleted) {
            return ResponseEntity.ok("Transaction deleted successfully!");
        } else {
            return ResponseEntity.status(404).body("Transaction not found!");
        }
    }

    // ✅ 6. Get recent 3 transactions (for Dashboard)
    @GetMapping("/recent/{userId}")
    public List<Transaction> getRecentTransactions(@PathVariable Long userId) {
        List<Transaction> transactions = transactionService.getTransactionsByUser(userId);
        return transactions.stream()
                .sorted(Comparator.comparing(Transaction::getDate).reversed()) // sort by newest date
                .limit(3)
                .toList(); // return only 3
    }

    // ✅ 7. Test route
    @GetMapping("/ping")
    public String ping() {
        return "Transaction Controller OK ✅";
    }
}
