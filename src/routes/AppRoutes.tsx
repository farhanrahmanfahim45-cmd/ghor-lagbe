import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Search from "@/pages/Search";
import Find from "@/pages/Find";
import SpaceDetail from "@/pages/SpaceDetail";
import Compare from "@/pages/Compare";
import Saved from "@/pages/Saved";
import Portfolio from "@/pages/Portfolio";
import ListSpace from "@/pages/ListSpace";
import Requests from "@/pages/Requests";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/search" element={<Search />} />
      <Route path="/find" element={<Find />} />
      <Route path="/space/:id" element={<SpaceDetail />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/list" element={<ListSpace />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/profile" element={<Profile />} />
      {/* Old Ghor Lagbe paths, kept so shared links don't break */}
      <Route path="/property/:id" element={<Navigate to="/portfolio" replace />} />
      <Route path="/intake" element={<Navigate to="/find" replace />} />
      <Route path="/list-property" element={<Navigate to="/list" replace />} />
      <Route path="/owner" element={<Navigate to="/portfolio" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
