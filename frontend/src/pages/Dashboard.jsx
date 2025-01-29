import FriendList from "../components/FriendList";
import FriendRecommendations from "../components/FriendRecommendations";
import Navbar from "../components/NavBar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto pt-12">
        <h2 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h2>
        <FriendList />
        <FriendRecommendations />
      </div>
    </>
  );
};

export default Dashboard;
