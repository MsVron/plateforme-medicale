#!/usr/bin/env node

/**
 * Convert 2024 to 2025 Appointments Script
 * =====================================
 * This script converts all 2024 dates to 2025 dates in the appointment migration files
 * 
 * Usage: node convert_2024_to_2025_appointments.js
 */

const fs = require('fs');
const path = require('path');

// Files to convert
const FILES_TO_CONVERT = [
    'plateforme-medicale/backend/migrations/03_enhanced_medical_records/populate_appointments_june2024.sql',
    'plateforme-medicale/backend/migrations/03_enhanced_medical_records/populate_appointments_may_june2024.sql',
    'plateforme-medicale/backend/migrations/03_enhanced_medical_records/populate_appointments_june24_30_2024.sql',
    'plateforme-medicale/backend/migrations/03_enhanced_medical_records/populate_dr_amina_benali_june2024.sql'
];

// Documentation files to update
const DOCS_TO_UPDATE = [
    'plateforme-medicale/backend/migrations/05_documentation/JUNE_2024_APPOINTMENTS_SUMMARY.md',
    'plateforme-medicale/backend/migrations/05_documentation/DR_AMINA_BENALI_JUNE2024_SUMMARY.md'
];

/**
 * Convert dates from 2024 to 2025 in SQL content
 */
function convertSQLDates(content) {
    console.log('Converting SQL dates from 2024 to 2025...');
    
    // Replace all occurrences of 2024 dates with 2025 dates
    let updatedContent = content.replace(/2024-(\d{2}-\d{2})/g, '2025-$1');
    
    // Update comments and headers
    updatedContent = updatedContent.replace(/2024/g, '2025');
    updatedContent = updatedContent.replace(/June 2025/g, 'June 2025');
    updatedContent = updatedContent.replace(/May 2025/g, 'May 2025');
    
    return updatedContent;
}

/**
 * Convert dates from 2024 to 2025 in documentation content
 */
function convertDocDates(content) {
    console.log('Converting documentation dates from 2024 to 2025...');
    
    // Replace all occurrences of 2024 with 2025
    let updatedContent = content.replace(/2024/g, '2025');
    
    // Update specific references
    updatedContent = updatedContent.replace(/June 2025/g, 'June 2025');
    updatedContent = updatedContent.replace(/May 2025/g, 'May 2025');
    
    return updatedContent;
}

/**
 * Rename files from 2024 to 2025
 */
function getNewFileName(oldFileName) {
    return oldFileName.replace(/2024/g, '2025');
}

/**
 * Process a single file
 */
function processFile(filePath, isDocumentation = false) {
    try {
        console.log(`\n📄 Processing: ${filePath}`);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`❌ File not found: ${filePath}`);
            return false;
        }
        
        // Read file content
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`📖 Read ${content.length} characters`);
        
        // Convert dates
        const updatedContent = isDocumentation ? 
            convertDocDates(content) : 
            convertSQLDates(content);
        
        // Generate new filename
        const newFilePath = getNewFileName(filePath);
        
        // Write to new file
        fs.writeFileSync(newFilePath, updatedContent, 'utf8');
        console.log(`✅ Created: ${newFilePath}`);
        
        // If it's a new file (renamed), optionally remove old file
        if (newFilePath !== filePath) {
            console.log(`🔄 Renamed from: ${filePath}`);
            console.log(`🔄 Renamed to: ${newFilePath}`);
            
            // Ask user if they want to remove old file
            console.log(`⚠️  Old file still exists: ${filePath}`);
            console.log(`   You may want to remove it manually after verification.`);
        }
        
        return true;
        
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Main execution function
 */
function main() {
    console.log('🚀 Starting 2024 to 2025 Appointments Conversion');
    console.log('='.repeat(50));
    
    let successCount = 0;
    let totalFiles = FILES_TO_CONVERT.length + DOCS_TO_UPDATE.length;
    
    // Process SQL files
    console.log('\n📋 Converting SQL Migration Files:');
    FILES_TO_CONVERT.forEach(filePath => {
        if (processFile(filePath, false)) {
            successCount++;
        }
    });
    
    // Process documentation files
    console.log('\n📚 Converting Documentation Files:');
    DOCS_TO_UPDATE.forEach(filePath => {
        if (processFile(filePath, true)) {
            successCount++;
        }
    });
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎯 CONVERSION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully processed: ${successCount}/${totalFiles} files`);
    
    if (successCount === totalFiles) {
        console.log('🎉 All files converted successfully!');
        console.log('\n📋 New files created:');
        
        // List new files
        [...FILES_TO_CONVERT, ...DOCS_TO_UPDATE].forEach(oldPath => {
            const newPath = getNewFileName(oldPath);
            console.log(`   • ${newPath}`);
        });
        
        console.log('\n⚠️  IMPORTANT NOTES:');
        console.log('   • Original 2024 files are still present');
        console.log('   • Review the new 2025 files before using them');
        console.log('   • Update any references to the old filenames');
        console.log('   • Consider removing old 2024 files after verification');
        
        console.log('\n🔧 Next steps:');
        console.log('   1. Review the generated 2025 files');
        console.log('   2. Update migration order documentation');
        console.log('   3. Test the new SQL files');
        console.log('   4. Remove old 2024 files if desired');
        
    } else {
        console.log('❌ Some files could not be processed');
        console.log('   Please check the errors above and try again');
    }
    
    console.log('\n✨ Conversion process completed!');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    convertSQLDates,
    convertDocDates,
    processFile,
    getNewFileName
}; 