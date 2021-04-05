import Navbar from "../navbar";
import Footer from "../footer";
const Layout = ({ children, withFooter = false }) => {
  return (
    <div className="w-screen min-h-screen bg-gray-50 flex justify-center overflow-auto">
      <div className="w-full h-screen max-w-screen-2xl flex flex-col space-y-10 p-2">
        <Navbar />
        {children}
        {withFooter && <Footer />}
      </div>
    </div>
  );
};
export default Layout;
