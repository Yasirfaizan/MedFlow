const styles = {
  green: "badge-green",
  yellow: "badge-yellow",
  red: "badge-red",
  blue: "badge-blue",
};

export default function Badge({ color = "blue", children }) {
  return <span className={styles[color] || styles.blue}>{children}</span>;
}
