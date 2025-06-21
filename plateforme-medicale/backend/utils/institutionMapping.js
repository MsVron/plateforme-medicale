/**
 * Maps institution types to user roles according to the system specification
 * 
 * According to the system design:
 * - hôpital, clinique, centre médical -> hospital role (same functionality)
 * - laboratoire -> laboratory role
 * - pharmacie -> pharmacy role  
 * - cabinet privé -> institution role (general medical institution)
 */

const getInstitutionUserRole = (institutionType) => {
    switch(institutionType) {
        case 'hôpital':
        case 'clinique':
        case 'centre médical':
            return 'hospital';
        case 'laboratoire':
            return 'laboratory';
        case 'pharmacie':
            return 'pharmacy';
        case 'cabinet privé':
        default:
            return 'institution';
    }
};

/**
 * Gets the theme color for an institution type
 */
const getInstitutionTheme = (institutionType) => {
    const userRole = getInstitutionUserRole(institutionType);
    switch(userRole) {
        case 'hospital':
            return 'red'; // Hospital theme
        case 'laboratory':
            return 'orange'; // Laboratory theme
        case 'pharmacy':
            return 'purple'; // Pharmacy theme
        case 'institution':
        default:
            return 'green'; // Medical institution theme
    }
};

/**
 * Validates if an institution type is valid
 */
const isValidInstitutionType = (type) => {
    const validTypes = ['hôpital', 'clinique', 'centre médical', 'cabinet privé', 'laboratoire', 'pharmacie'];
    return validTypes.includes(type);
};

/**
 * Gets all available institution types
 */
const getInstitutionTypes = () => {
    return [
        'hôpital',
        'clinique', 
        'centre médical',
        'cabinet privé',
        'laboratoire',
        'pharmacie'
    ];
};

module.exports = {
    getInstitutionUserRole,
    getInstitutionTheme,
    isValidInstitutionType,
    getInstitutionTypes
}; 