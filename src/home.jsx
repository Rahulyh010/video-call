import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <nav>
        <h1>
          <Link to={"/one2one"}>One2One</Link>
        </h1>
      </nav>
    </div>
  );
};
