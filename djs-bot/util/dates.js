const { DateTime, Duration } = require("luxon");

/**
 * Date span genertor
 * default offsets are 0 (current date)
 * 
 * @param {string} beg Start date string (year, month, week, day)
 * @param {Object} begOffset offset from the beggining date (in spans of beg)
 * @param {string} end End date string (year, month, week, day)
 * @param {Object} endOffset offset from the end date (in spans of end)
 * @returns {String[]} An array containing the start and end date of the span selected
 * 
 * @example dateSpan("week", "week", { days: 0 }, { days: 0 }) // [This Monday, This Sunday]
 * @example dateSpan("week", "week", { week: 1 }, { week: 1 }) // [Next Monday, Next Sunday]
 * @example dateSpan("week", "week", { week: -1 }, { week: -1 }) // [Last Monday, Last Sunday]
 * @example dateSpan("day", "day", { days: 1 }, { days: 1 }) // [Start of Tomorrow, End of Tomorrow]
 * @example dateSpan("day", "day", { days: -1 }, { days: -1 }) // [Start of Yesterday, End of Yesterday]
 * @example dateSpan("year", "year", { year: 1 }, { year: 1 }) // [Next year, Next year]
 * @example dateSpan("month", "month", { month: 1 }, { month: 1 }) // [Start of Next month, End of Next month]
 * @example dateSpan("month", "month", { month: -1 }, { month: -1 }) // [Start of Last month, End of Last month]
 * @example dateSpan("week", "day", { days: 0 }, { days: 0 }) // [This Monday, End of Today]
 * @example dateSpan("week", "day", { days: -1 }, { days: 1 }) // [Start of Last Sunday, End of Tomorrow]
 * @example dateSpan("month", "week", { week: 1 }, { days: -1 }) // [Start of 7th day of This Month, End of This Saturday]
 */
function dateSpan(beg, end, begOffset = { days: 0 }, endOffset = { days: 0 }) {
	const now = DateTime.now();

	return [
		now.startOf(beg).plus(Duration.fromObject(begOffset)).toString().substring(0, 10),
		now.endOf(end).plus(Duration.fromObject(endOffset)).toString().substring(0, 10)
	];
}

/**
 * Comodity function to get the current week span (without paramaters) from the dateSpan function) 
 *
 * @param {Object} begOffset offset from the beggining date
 * @param {Object} endOffset offset from the end date 
 * 
 * @returns {String[]} [This Monday, This Sunday] by default
 */
function thisWeek(begOffset = { days: 0 }, endOffset = { days: 0 }) {
	return dateSpan("week", "week", begOffset, endOffset);
}

module.exports = {
	thisWeek,
	dateSpan,
};