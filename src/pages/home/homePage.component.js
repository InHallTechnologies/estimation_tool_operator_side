import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import EntriesList from "../../components/EntriesList/EntriesList.component";
import FilterContainer from "../../components/FilterContainer/FilterContainer.component";
import HomeNavigation from "../../components/HomeNavigation/HomeNavigation.component";
import { SearchProvider } from "../../context/search-context";
import './homePage.styles.scss';

const HomePage = () => {
    const navigation = useNavigate();
    console.log("rerenderred");
    return (
        <div className="home-page-container">
            <Helmet>
                <title>Estimation Tool</title>
            </Helmet>
            <HomeNavigation />
            <FilterContainer />
            <EntriesList />
        </div>
    )
}

export default HomePage