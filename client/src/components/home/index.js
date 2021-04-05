import SheetList from "../sheet-list";
import AddCard from "./AddCard";
import Layout from "../common/Layout";

const Home = () => {
  return (
    <Layout withFooter>
      <div className="flex-grow bg-blue-100 rounded-xl py-10 px-2 md:px-5 lg:px-10">
        <AddCard />
        <hr className="my-6 border-0" />
        <SheetList listTitle="Browse sheets" />
      </div>
    </Layout>
  );
};

export default Home;
