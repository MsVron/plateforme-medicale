/**
 * Test script for appointment slot generation
 * Run with: node test-slots.js
 */
const { addDays, format, parseISO } = require('date-fns');
const slotUtils = require('./controllers/appointments/slotGeneratorUtils');

// Create a date in local time zone to avoid timezone issues
const today = new Date();
const testDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

// Example doctor schedule (similar to what's in the database)
const exampleSchedule = {
  heure_debut: `${testDate}T09:00:00`,
  heure_fin: `${testDate}T17:00:00`,
  intervalle_minutes: 30,
  a_pause_dejeuner: true,
  heure_debut_pause: `${testDate}T12:00:00`,
  heure_fin_pause: `${testDate}T13:00:00`
};

// Example booked slots (matching the requirements: 10:00 and 11:30)
const bookedSlots = [
  {
    start: `${testDate}T10:00:00`,
    end: `${testDate}T10:30:00`
  },
  {
    start: `${testDate}T11:30:00`,
    end: `${testDate}T12:00:00`
  }
];

console.log('Testing slot generator with:');
console.log('Test date:', testDate);
console.log('Doctor schedule:', exampleSchedule);
console.log('Booked slots:', bookedSlots);

// Generate the expected times manually
console.log('\nManually calculating expected times:');
const allPossibleTimes = [];
for (let hour = 9; hour < 17; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    allPossibleTimes.push(timeStr);
  }
}
console.log('All possible times from 9:00 to 17:00 with 30 min intervals:');
console.log(allPossibleTimes.join(', '));

// Remove booked times
const bookedTimes = ['10:00', '11:30'];
// Remove lunch break times
const lunchTimes = [];
for (let hour = 12; hour < 13; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    lunchTimes.push(timeStr);
  }
}

console.log('Booked times:', bookedTimes.join(', '));
console.log('Lunch break times:', lunchTimes.join(', '));

// Calculate expected times
const expectedTimes = allPossibleTimes.filter(
  time => !bookedTimes.includes(time) && !lunchTimes.includes(time)
);
console.log('Expected available times after removing booked and lunch times:');
console.log(expectedTimes.join(', '));

// Generate available slots
try {
  const availableSlots = slotUtils.generateAvailableSlots(exampleSchedule, bookedSlots, 'HH:mm');
  console.log('\nGenerated available slots:', availableSlots.length);
  console.log('First few slots:', JSON.stringify(availableSlots.slice(0, 3), null, 2));
  
  // Format slots for display
  const formattedSlots = slotUtils.formatSlotsForDisplay(availableSlots);
  console.log('\nFormatted slots for display:', formattedSlots.length);
  console.log('First few formatted slots:', JSON.stringify(formattedSlots.slice(0, 3), null, 2));
  
  // Show all available times
  console.log('\nAll generated available times:');
  const availableTimes = formattedSlots.map(slot => slot.time);
  console.log(availableTimes.join(', '));
  
  // Check if expected times match actual times
  const missingTimes = expectedTimes.filter(time => !availableTimes.includes(time));
  const extraTimes = availableTimes.filter(time => !expectedTimes.includes(time));
  
  if (missingTimes.length === 0 && extraTimes.length === 0) {
    console.log('\n✅ TEST PASSED: Generated times match expected times');
  } else {
    console.log('\n❌ TEST FAILED: Generated times do not match expected times');
    if (missingTimes.length > 0) {
      console.log('Missing times:', missingTimes.join(', '));
    }
    if (extraTimes.length > 0) {
      console.log('Extra times:', extraTimes.join(', '));
    }
  }
  
} catch (error) {
  console.error('Error testing slot generator:', error);
} 