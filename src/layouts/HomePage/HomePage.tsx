import { Carasusel } from "./components/Carasusel";
import { ExploreTopBooks } from "./components/ExploreTopBooks";
import { Heros } from "./components/Heros";
import { LibraryServices } from "./components/LibraryService";

export const HomePage = () => {
    return (
    <div>
    <ExploreTopBooks/>
    <Carasusel/>
    <Heros/>
    <LibraryServices/>
    </div>
    );
}