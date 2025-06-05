import { createEvents } from "ics";
import { format } from "date-fns";

/**
 * Converts trip data to calendar events and downloads as .ics file
 * @param {Array} days - Array of trip days with activities
 * @param {string} tripTitle - Title of the trip
 */
export const exportToCalendar = (days, tripTitle) => {
  console.log("Exporting to calendar:", { days, tripTitle });

  try {
    if (!days || days.length === 0) {
      throw new Error("No days to export");
    }

    // Convert all activities to calendar events
    const events = [];

    days.forEach((day) => {
      const dayDate = new Date(day.date);

      if (day.activities && day.activities.length > 0) {
        day.activities.forEach((activity) => {
          let eventStart, eventEnd;

          if (activity.time) {
            // If activity has a specific time, use it
            const activityTime = new Date(activity.time);
            eventStart = [
              dayDate.getFullYear(),
              dayDate.getMonth() + 1,
              dayDate.getDate(),
              activityTime.getHours(),
              activityTime.getMinutes(),
            ];
            // Default 1 hour duration
            eventEnd = [
              dayDate.getFullYear(),
              dayDate.getMonth() + 1,
              dayDate.getDate(),
              activityTime.getHours() + 1,
              activityTime.getMinutes(),
            ];
          } else {
            // If no specific time, create all-day event
            eventStart = [
              dayDate.getFullYear(),
              dayDate.getMonth() + 1,
              dayDate.getDate(),
            ];
            eventEnd = [
              dayDate.getFullYear(),
              dayDate.getMonth() + 1,
              dayDate.getDate() + 1,
            ];
          }

          const description = [
            activity.description || "",
            activity.location ? `📍 Location: ${activity.location}` : "",
            activity.notes ? `💡 Notes: ${activity.notes}` : "",
            activity.category ? `🏷️ Category: ${activity.category}` : "",
          ]
            .filter(Boolean)
            .join("\n");

          events.push({
            start: eventStart,
            end: eventEnd,
            title: activity.title,
            description,
            location: activity.location || "",
            categories: ["Travel", activity.category || "Activity"].filter(
              Boolean
            ),
            status: "CONFIRMED",
          });
        });
      } else {
        // Create a day placeholder event if no activities
        events.push({
          start: [
            dayDate.getFullYear(),
            dayDate.getMonth() + 1,
            dayDate.getDate(),
          ],
          end: [
            dayDate.getFullYear(),
            dayDate.getMonth() + 1,
            dayDate.getDate() + 1,
          ],
          title: `${tripTitle} - ${format(dayDate, "MMM d")}`,
          description: "Trip day - no specific activities planned",
          categories: ["Travel"],
          status: "CONFIRMED",
        });
      }
    });

    console.log("Creating events:", events.length, "events");

    // Create ICS content
    const { error, value } = createEvents(events);

    if (error) {
      console.error("Error creating calendar events:", error);
      throw new Error("Failed to create calendar events");
    }

    console.log("ICS content generated successfully");

    // Download the .ics file
    const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tripTitle
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_activities.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log("Calendar export completed successfully");
    return true;
  } catch (error) {
    console.error("Calendar export error:", error);
    throw error;
  }
};

/**
 * Creates a single trip overview event
 * @param {Array} days - Array of trip days
 * @param {string} tripTitle - Title of the trip
 */
export const exportTripOverview = (days, tripTitle) => {
  if (days.length === 0) {
    throw new Error("No days to export");
  }

  try {
    const sortedDays = [...days].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const firstDay = new Date(sortedDays[0].date);
    const lastDay = new Date(sortedDays[sortedDays.length - 1].date);

    const totalActivities = days.reduce(
      (total, day) => total + day.activities.length,
      0
    );

    const event = {
      start: [
        firstDay.getFullYear(),
        firstDay.getMonth() + 1,
        firstDay.getDate(),
      ],
      end: [
        lastDay.getFullYear(),
        lastDay.getMonth() + 1,
        lastDay.getDate() + 1,
      ], // End day after last day
      title: tripTitle,
      description: [
        `${days.length} day trip with ${totalActivities} planned activities`,
        "",
        "Daily breakdown:",
        ...days.map(
          (day) =>
            `• ${format(new Date(day.date), "MMM d")}: ${
              day.activities.length
            } activities`
        ),
      ].join("\n"),
      categories: ["Travel", "Trip", "Vacation"],
      status: "CONFIRMED",
      startInputType: "local",
      startOutputType: "local",
    };

    const { error, value } = createEvents([event]);

    if (error) {
      console.error("Error creating trip overview:", error);
      throw new Error("Failed to create trip overview");
    }

    const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tripTitle
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_overview.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Trip overview export error:", error);
    throw error;
  }
};
