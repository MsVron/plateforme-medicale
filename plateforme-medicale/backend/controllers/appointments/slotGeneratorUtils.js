/**
 * Utility functions for generating appointment time slots
 */
const { addMinutes, format, parseISO, isBefore, isWithinInterval } = require('date-fns');

/**
 * Formats time in 24-hour format (HH:mm)
 * 
 * @param {Date|string} time - Time to format
 * @returns {string} Formatted time in 24-hour format
 */
function formatTime(time) {
  if (!time) return '';
  
  // If it's a Date object or a full date string, format it
  const date = typeof time === 'string' ? parseISO(time) : time;
  if (date instanceof Date && !isNaN(date.getTime())) {
    return format(date, 'HH:mm');
  }
  
  return '';
}

/**
 * Formats date in dd/MM/yyyy format
 * 
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
    return format(dateObj, 'dd/MM/yyyy');
  }
  
  return '';
}

/**
 * Generates available appointment slots for a given doctor's schedule
 * 
 * @param {Object} doctorSchedule - The doctor's schedule details
 * @param {string} doctorSchedule.heure_debut - Start time in ISO format
 * @param {string} doctorSchedule.heure_fin - End time in ISO format
 * @param {number} doctorSchedule.intervalle_minutes - Duration of each appointment slot in minutes
 * @param {boolean} doctorSchedule.a_pause_dejeuner - Whether the doctor takes a lunch break
 * @param {string} doctorSchedule.heure_debut_pause - Start of lunch break in ISO format
 * @param {string} doctorSchedule.heure_fin_pause - End of lunch break in ISO format
 * @param {Array} bookedSlots - Array of already booked slots
 * @param {string} bookedSlots[].start - Start time of booked slot in ISO format
 * @param {string} bookedSlots[].end - End time of booked slot in ISO format
 * @param {string} timeFormat - Format for displaying times (default: 'HH:mm' for 24-hour format)
 * @returns {Array} Available slots with slot number and formatted time
 */
function generateAvailableSlots(doctorSchedule, bookedSlots = [], timeFormat = 'HH:mm') {
  console.log('DEBUG: generateAvailableSlots called with:');
  console.log('doctorSchedule:', doctorSchedule);
  console.log('bookedSlots:', bookedSlots);
  console.log('timeFormat:', timeFormat);

  if (!doctorSchedule) {
    throw new Error('Doctor schedule not available');
  }

  const slots = [];
  
  try {
    // Parse doctor's schedule
    const startTime = parseISO(doctorSchedule.heure_debut);
    const endTime = parseISO(doctorSchedule.heure_fin);
    const interval = doctorSchedule.intervalle_minutes || 30;
    
    console.log('DEBUG: Parsed schedule:', {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      interval
    });
    
    // Create lunch break time range if applicable
    let lunchStart = null;
    let lunchEnd = null;
    if (doctorSchedule.a_pause_dejeuner) {
      lunchStart = parseISO(doctorSchedule.heure_debut_pause);
      lunchEnd = parseISO(doctorSchedule.heure_fin_pause);
      console.log('DEBUG: Lunch break:', {
        lunchStart: lunchStart.toISOString(),
        lunchEnd: lunchEnd.toISOString()
      });
    }

    // Convert booked slots to array of parsed times for easier comparison
    const bookedTimes = [];
    for (const slot of bookedSlots) {
      const start = typeof slot.start === 'string' ? parseISO(slot.start) : slot.start;
      const slotStart = format(start, 'HH:mm');
      bookedTimes.push(slotStart);
    }
    
    console.log('DEBUG: Booked times:', bookedTimes);
    
    // Generate all possible time slots
    let currentTime = new Date(startTime);
    let slotNumber = 1;
    
    // Loop through each possible time slot
    while (currentTime < endTime) {
      const timeString = format(currentTime, 'HH:mm');
      const slotEnd = addMinutes(currentTime, interval);
      
      // Check if this slot is during lunch break
      let isDuringLunch = false;
      if (lunchStart && lunchEnd) {
        isDuringLunch = 
          (currentTime >= lunchStart && currentTime < lunchEnd) || 
          (slotEnd > lunchStart && slotEnd <= lunchEnd) ||
          (currentTime < lunchStart && slotEnd > lunchEnd);
      }
      
      // Check if this time is booked
      const isBooked = bookedTimes.includes(timeString);
      
      console.log(`DEBUG: Checking slot ${timeString} - isDuringLunch: ${isDuringLunch}, isBooked: ${isBooked}`);
      
      if (!isDuringLunch && !isBooked) {
        slots.push({
          slotNumber,
          time: timeString,
          start: currentTime,
          end: slotEnd
        });
        slotNumber++;
      }
      
      // Move to next time slot
      currentTime = slotEnd;
    }
    
    console.log('DEBUG: Generated slots:', slots.length);
    console.log('DEBUG: All generated times:', slots.map(s => s.time).join(', '));
    
    return slots;
  } catch (error) {
    console.error('DEBUG: Error generating available slots:', error);
    throw error;
  }
}

/**
 * Formats slots for API response
 * 
 * @param {Array} slots - The generated slots
 * @returns {Array} Formatted slots for API response
 */
function formatSlotsForResponse(slots) {
  return slots.map(slot => ({
    slot: `Slot ${slot.slotNumber}`,
    time: slot.time,
    debut: format(slot.start, "yyyy-MM-dd'T'HH:mm:ss"),
    fin: format(slot.end, "yyyy-MM-dd'T'HH:mm:ss")
  }));
}

/**
 * Formats slots according to requirements (for horizontal slider display)
 * 
 * @param {Array} slots - The generated slots
 * @returns {Array} Formatted slots for display in horizontal slider
 */
function formatSlotsForDisplay(slots) {
  console.log('DEBUG: formatSlotsForDisplay called with slots:', slots.length);
  
  try {
    // Ensure we have all necessary data for the frontend
    const formattedSlots = slots.map(slot => ({
      slot: slot.slotNumber,
      time: slot.time,
      debut: format(slot.start, "yyyy-MM-dd'T'HH:mm:ss"),
      fin: format(slot.end, "yyyy-MM-dd'T'HH:mm:ss")
    }));
    
    console.log('DEBUG: First few formatted slots:', formattedSlots.slice(0, 3));
    return formattedSlots;
  } catch (error) {
    console.error('DEBUG: Error in formatSlotsForDisplay:', error);
    return [];
  }
}

/**
 * Checks if a slot is available
 * 
 * @param {Date} slotStart - The start time of the slot to check
 * @param {Date} slotEnd - The end time of the slot to check
 * @param {Array} bookedSlots - Array of already booked slots
 * @param {Object} doctorSchedule - The doctor's schedule
 * @returns {boolean} True if the slot is available, false otherwise
 */
function isSlotAvailable(slotStart, slotEnd, bookedSlots, doctorSchedule) {
  // Check if slot is within doctor's working hours
  if (isBefore(slotStart, parseISO(doctorSchedule.heure_debut)) || 
      !isBefore(slotEnd, parseISO(doctorSchedule.heure_fin))) {
    return false;
  }
  
  // Check if slot is during lunch break
  if (doctorSchedule.a_pause_dejeuner) {
    const lunchStart = parseISO(doctorSchedule.heure_debut_pause);
    const lunchEnd = parseISO(doctorSchedule.heure_fin_pause);
    
    if (isWithinInterval(slotStart, { start: lunchStart, end: lunchEnd }) ||
        isWithinInterval(slotEnd, { start: lunchStart, end: lunchEnd })) {
      return false;
    }
  }
  
  // Check if slot is already booked
  for (const bookedSlot of bookedSlots) {
    const bookedStart = typeof bookedSlot.start === 'string' ? 
      parseISO(bookedSlot.start) : bookedSlot.start;
    const bookedEnd = typeof bookedSlot.end === 'string' ? 
      parseISO(bookedSlot.end) : bookedSlot.end;
    
    if (isWithinInterval(slotStart, { start: bookedStart, end: bookedEnd }) ||
        isWithinInterval(slotEnd, { start: bookedStart, end: bookedEnd })) {
      return false;
    }
  }
  
  return true;
}

module.exports = {
  generateAvailableSlots,
  formatSlotsForResponse,
  formatSlotsForDisplay,
  isSlotAvailable,
  formatTime,
  formatDate
}; 