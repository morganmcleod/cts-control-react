export default function localDate(ts) {
  let date = new Date(ts);
  date = new Date(date.valueOf() - 60000 * date.getTimezoneOffset());
  return date.toLocaleString("en", { weekday: "short"}) + ", " + date.toJSON().slice(0, 19).replace('T', ' ');    
}
