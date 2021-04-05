import Auth from "./Auth";
import Logo from "./Logo";
const Navbar = () => {
  return (
    <header className="flex justify-between items-center">
      <Logo />
      <Auth />
    </header>
  );
};
export default Navbar;
