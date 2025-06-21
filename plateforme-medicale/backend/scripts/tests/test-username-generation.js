/**
 * Test script to demonstrate username generation for institutions
 * Shows how various French characters are handled
 */

// Function to clean text for username generation (same as in adminRoutes.js)
const cleanTextForUsername = (text) => {
    return text.toLowerCase()
        // French accented characters
        .replace(/[àáâãäåæ]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõöø]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ýÿ]/g, 'y')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n')
        // Additional French characters
        .replace(/[œ]/g, 'oe')
        .replace(/[ß]/g, 'ss')
        // Remove all non-alphanumeric characters
        .replace(/[^a-z0-9]/g, '');
};

// Special handling for institution types
const getCleanType = (type) => {
    const lowerType = type.toLowerCase();
    if (lowerType === 'centre médical' || lowerType === 'centre medical') {
        return 'centre';
    }
    return cleanTextForUsername(type);
};

// Function to generate username (same logic as backend)
const generateUsername = (nom, type) => {
    const cleanType = getCleanType(type);
    const cleanName = cleanTextForUsername(nom);
    return `${cleanType}.${cleanName}`;
};

// Test cases with various French characters and special cases
const testCases = [
    // Basic cases
    { type: 'hôpital', nom: 'Mohammed V', expected: 'hopital.mohammedv' },
    { type: 'clinique', nom: 'Al Farabi', expected: 'clinique.alfarabi' },
    { type: 'pharmacie', nom: 'Centrale', expected: 'pharmacie.centrale' },
    { type: 'laboratoire', nom: 'Bio Lab', expected: 'laboratoire.biolab' },
    
    // French accented characters
    { type: 'hôpital', nom: 'Hôpital Français', expected: 'hopital.hopitalfrancais' },
    { type: 'clinique', nom: 'Médecin Spécialisé', expected: 'clinique.medecinspecialise' },
    { type: 'pharmacie', nom: 'Château d\'Eau', expected: 'pharmacie.chateaudeau' },
    { type: 'laboratoire', nom: 'Université de Médecine', expected: 'laboratoire.universitedemedecine' },
    
    // Complex cases with many special characters
    { type: 'centre médical', nom: 'Centre Médico-Social "Les Œillets"', expected: 'centre.centremedicosociallesoeillets' },
    { type: 'hôpital', nom: 'Hôpital Régional & Universitaire', expected: 'hopital.hopitalregionaluniversitaire' },
    { type: 'clinique', nom: 'Clinique Privée (S.A.R.L)', expected: 'clinique.cliniquepriveesarl' },
    { type: 'pharmacie', nom: 'Pharmacie du Cœur', expected: 'pharmacie.pharmacieducoeur' },
    
    // Edge cases
    { type: 'laboratoire', nom: 'Lab@Test-2024!', expected: 'laboratoire.labtest2024' },
    { type: 'hôpital', nom: '123 Hôpital Numérique', expected: 'hopital.123hopitalnumerique' },
    { type: 'clinique', nom: 'Clinique ñoël & Associés', expected: 'clinique.cliniquenoelassocies' },
    
    // Real Moroccan examples
    { type: 'hôpital', nom: 'Hôpital Ibn Sina', expected: 'hopital.hopitalibnsina' },
    { type: 'clinique', nom: 'Clinique Cheikh Zaïd', expected: 'clinique.cliniquecheikhzaid' },
    { type: 'pharmacie', nom: 'Pharmacie Al Maghrib', expected: 'pharmacie.pharmaciealmaghrib' },
    { type: 'laboratoire', nom: 'Laboratoire Pasteur Maroc', expected: 'laboratoire.laboratoirepasteurmaroc' },
    
    // Space handling tests
    { type: 'hôpital', nom: 'Hospital With Many Spaces', expected: 'hopital.hospitalwithmanyspaces' },
    { type: 'centre médical', nom: 'Centre de Santé', expected: 'centre.centredesante' },
    { type: 'pharmacie', nom: 'Grande Pharmacie Centrale', expected: 'pharmacie.grandepharmaciecentrale' }
];

console.log('🧪 Testing Username Generation for Institutions');
console.log('================================================\n');

let passedTests = 0;
let failedTests = 0;

testCases.forEach((testCase, index) => {
    const result = generateUsername(testCase.nom, testCase.type);
    const passed = result === testCase.expected;
    
    if (passed) {
        console.log(`✅ Test ${index + 1}: PASSED`);
        passedTests++;
    } else {
        console.log(`❌ Test ${index + 1}: FAILED`);
        failedTests++;
    }
    
    console.log(`   Type: "${testCase.type}"`);
    console.log(`   Name: "${testCase.nom}"`);
    console.log(`   Expected: "${testCase.expected}"`);
    console.log(`   Got:      "${result}"`);
    console.log('');
});

console.log('📊 Test Results:');
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📈 Success Rate: ${((passedTests / testCases.length) * 100).toFixed(1)}%`);

if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Username generation is working correctly.');
} else {
    console.log('\n⚠️  Some tests failed. Please check the username generation logic.');
}

// Additional examples to show character handling
console.log('\n🔤 Character Conversion Examples:');
console.log('==================================');

const characterExamples = [
    'àáâãäåæ → a',
    'èéêë → e', 
    'ìíîï → i',
    'òóôõöø → o',
    'ùúûü → u',
    'ýÿ → y',
    'ç → c',
    'ñ → n',
    'œ → oe',
    'ß → ss',
    'Spaces: "Hello World" → "helloworld"',
    'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>? → removed',
    'Special type: "centre médical" → "centre"'
];

characterExamples.forEach(example => {
    console.log(`   ${example}`);
});

console.log('\n✨ The username generation ensures all usernames contain only [a-z0-9] characters!');

module.exports = {
    cleanTextForUsername,
    generateUsername
}; 