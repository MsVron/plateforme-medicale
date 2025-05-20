import { useState, useEffect } from 'react';
import { parseISO, addMinutes, isBefore, isWithinInterval } from 'date-fns';
import { formatTime, formatDate } from '../utils/dateUtils';

/**
 * Custom hook for generating and formatting time slots
 * 
 * @param {Object} doctorSchedule - The doctor's schedule details
 * @param {Array} bookedSlots - Array of already booked slots
 * @param {string} selectedDate - Selected date in ISO format
 * @returns {Object} Formatted slots and loading state
 */
const useTimeSlots = (doctorSchedule, bookedSlots = [], selectedDate) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formattedSlots, setFormattedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorSchedule || !selectedDate) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // Generate slots based on doctor's schedule
      generateTimeSlots();
    } catch (err) {
      console.error('Error generating time slots:', err);
      setError('Failed to generate time slots');
      setLoading(false);
    }
  }, [doctorSchedule, bookedSlots, selectedDate]);

  // Add debugging logs to trace data flow
  useEffect(() => {
    console.log('DEBUG: useTimeSlots hook - doctorSchedule:', doctorSchedule);
    console.log('DEBUG: useTimeSlots hook - bookedSlots:', bookedSlots);
    console.log('DEBUG: useTimeSlots hook - selectedDate:', selectedDate);
  }, [doctorSchedule, bookedSlots, selectedDate]);

  useEffect(() => {
    console.log('DEBUG: useTimeSlots hook - availableSlots:', availableSlots);
    console.log('DEBUG: useTimeSlots hook - formattedSlots:', formattedSlots);
  }, [availableSlots, formattedSlots]);

  // Function to generate time slots
  const generateTimeSlots = () => {
    try {
      const slots = [];

      if (!doctorSchedule) {
        setError('Doctor schedule not available');
        setLoading(false);
        return;
      }

      // Parse doctor's schedule
      const startTime = parseISO(doctorSchedule.heure_debut);
      const endTime = parseISO(doctorSchedule.heure_fin);
      const interval = doctorSchedule.intervalle_minutes || 30;
      
      // Create lunch break time range if applicable
      let lunchStart = null;
      let lunchEnd = null;
      if (doctorSchedule.a_pause_dejeuner) {
        lunchStart = parseISO(doctorSchedule.heure_debut_pause);
        lunchEnd = parseISO(doctorSchedule.heure_fin_pause);
      }

      // Convert booked slots to Date objects for comparison
      const bookedTimeRanges = bookedSlots.map(slot => ({
        start: typeof slot.start === 'string' ? parseISO(slot.start) : slot.start,
        end: typeof slot.end === 'string' ? parseISO(slot.end) : slot.end
      }));

      // Generate all possible time slots
      let currentSlot = startTime;
      let slotNumber = 1;

      while (isBefore(currentSlot, endTime)) {
        const slotEnd = addMinutes(currentSlot, interval);
        
        // Check if this slot is during lunch break
        let isDuringLunch = false;
        if (lunchStart && lunchEnd) {
          isDuringLunch = isWithinInterval(currentSlot, { start: lunchStart, end: lunchEnd }) ||
                          isWithinInterval(slotEnd, { start: lunchStart, end: lunchEnd });
        }

        // Check if slot conflicts with booked appointments
        const isBooked = bookedTimeRanges.some(timeRange => 
          isWithinInterval(currentSlot, timeRange) || 
          isWithinInterval(slotEnd, timeRange)
        );

        if (!isDuringLunch && !isBooked) {
          // Format the time using the dateUtils library
          const formattedTime = formatTime(currentSlot);
          
          slots.push({
            number: slotNumber,
            debut: currentSlot,
            fin: slotEnd,
            time: formattedTime
          });
          slotNumber++;
        }

        currentSlot = slotEnd;
      }

      setAvailableSlots(slots);
      
      // Create a formatted version for the UI
      const formatted = slots.map(slot => ({
        number: slot.number,
        time: slot.time,
        debut: slot.debut,
        fin: slot.fin
      }));
      
      setFormattedSlots(formatted);
      setError('');
    } catch (err) {
      console.error('Error generating time slots:', err);
      setError('Failed to generate time slots');
    } finally {
      setLoading(false);
    }
  };

  return {
    slots: availableSlots,
    formattedSlots,
    loading,
    error,
    formattedDate: selectedDate ? formatDate(selectedDate) : ''
  };
};

export default useTimeSlots; 