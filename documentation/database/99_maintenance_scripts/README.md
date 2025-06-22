# 🔧 Database Maintenance Scripts

## 📋 Overview
This directory contains maintenance, cleanup, and debugging scripts for the medical platform database.

## ⚠️ Warning
**These scripts modify database structure or delete data. Always backup your database before running any of these scripts.**

## 📁 Files in This Directory

### **Orphaned Cabinet Cleanup Scripts**
Scripts to clean up orphaned private medical cabinets (dossiers_medicaux_prives):

- **`corrected_delete_orphaned_cabinets.sql`** - Corrected version of orphaned cabinet cleanup
- **`delete_orphaned_private_cabinets.sql`** - Original orphaned cabinet deletion script  
- **`delete_orphaned_private_cabinets_improved.sql`** - Improved version with better safety checks
- **`delete_orphaned_private_cabinets_working.sql`** - Working version tested in production
- **`safe_delete_orphaned_private_cabinets.sql`** - Safest version with extensive validation

### **Schema Fix Scripts**
- **`fix_handicap_columns.sql`** - Fixes handicap-related column issues in patient tables

### **Debugging & Testing**
- **`test_query.sql`** - Various test queries for debugging database issues

## 🚀 Usage Guidelines

### **Before Running Any Script:**
1. **Backup your database:**
   ```sql
   mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Test on a copy first:**
   - Create a test database copy
   - Run the script on the copy
   - Verify results before running on production

3. **Check dependencies:**
   - Ensure no applications are using the database
   - Verify you have appropriate permissions
   - Review foreign key constraints

### **Orphaned Cabinet Cleanup Process:**
The recommended order for orphaned cabinet cleanup:

1. **Start with the safest version:**
   ```sql
   -- Execute: safe_delete_orphaned_private_cabinets.sql
   ```

2. **If issues persist, try the working version:**
   ```sql
   -- Execute: delete_orphaned_private_cabinets_working.sql
   ```

3. **For complex cases, use the corrected version:**
   ```sql
   -- Execute: corrected_delete_orphaned_cabinets.sql
   ```

### **Handicap Column Fixes:**
```sql
-- If you have handicap field issues:
-- Execute: fix_handicap_columns.sql
```

## 🔍 Script Descriptions

### **Orphaned Cabinet Cleanup**
**Problem:** Private medical cabinets (dossiers_medicaux_prives) can become orphaned when:
- Associated patient records are deleted
- Institution relationships are broken
- Data integrity constraints are violated

**Solution:** These scripts identify and safely remove orphaned records while preserving data integrity.

**Safety Features:**
- Foreign key constraint checking
- Transaction rollback on errors
- Detailed logging of deleted records
- Validation of record relationships

### **Handicap Column Fixes**
**Problem:** Handicap support fields may have:
- Incorrect column types
- Missing default values  
- Constraint violations

**Solution:** Fixes column definitions and constraints for disability support features.

## 📊 Monitoring Results

### **After Orphaned Cabinet Cleanup:**
```sql
-- Check remaining orphaned records
SELECT COUNT(*) as remaining_orphaned 
FROM dossiers_medicaux_prives dmp
LEFT JOIN patients p ON dmp.patient_id = p.id
WHERE p.id IS NULL;

-- Check data integrity
SELECT COUNT(*) as total_private_cabinets 
FROM dossiers_medicaux_prives;
```

### **After Handicap Fixes:**
```sql
-- Verify handicap columns
DESCRIBE patients;
SHOW CREATE TABLE patients;
```

## 🎯 Best Practices

### **Testing:**
- Always test on non-production data first
- Verify row counts before and after
- Check application functionality after changes

### **Documentation:**
- Document what you ran and when
- Keep logs of any errors encountered
- Note any unexpected behavior

### **Recovery:**
- Keep database backups for at least 30 days after maintenance
- Test restore procedures before critical maintenance
- Have rollback plans for each script

## 🚨 Emergency Procedures

### **If a Script Fails:**
1. **Don't panic** - most scripts use transactions
2. **Check error logs** for specific error messages
3. **Restore from backup** if data corruption occurred
4. **Contact support** with error details and steps taken

### **If Data is Accidentally Deleted:**
1. **Stop all database operations immediately**
2. **Restore from the most recent backup**
3. **Identify what data was lost**
4. **Re-run only the necessary parts of the maintenance**

## 📞 Support
For issues with maintenance scripts:
1. Check database error logs first
2. Verify your MySQL version compatibility
3. Ensure proper user permissions
4. Review foreign key constraints
5. Test on smaller datasets first

## 🗂️ File History
| Script | Purpose | Last Updated | Status |
|--------|---------|--------------|---------|
| `safe_delete_orphaned_private_cabinets.sql` | Safest orphaned cleanup | Latest | ✅ Recommended |
| `delete_orphaned_private_cabinets_working.sql` | Working cleanup | Tested | ✅ Good |
| `corrected_delete_orphaned_cabinets.sql` | Corrected version | Updated | ✅ Good |
| `fix_handicap_columns.sql` | Handicap field fixes | Latest | ✅ Ready |
| `test_query.sql` | Debugging queries | Various | 🔍 Debug only | 