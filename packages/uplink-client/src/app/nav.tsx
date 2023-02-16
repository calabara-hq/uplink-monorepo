const t = async () => {
  return "hello";
};
export default async function Nav() {
  await t();
  return <div>hello from nav</div>;
}
