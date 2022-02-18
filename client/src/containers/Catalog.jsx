import React from "react";
import { SearchBar } from "../components";
import { SortContainer, FiltersContainer, ProductsContainer } from "./";

const Catalog = () => {
  return (
    <div className="catalog--container">
      <div className="catalog-search--container">
        <SearchBar />
        <FiltersContainer />
        <SortContainer />
      </div>
      <h2>
        Categoria
      </h2>
      <div className="catalog-content--container">
        <ProductsContainer />
      </div>
    </div>
  );
};

export default Catalog;
