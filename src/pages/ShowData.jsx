import React, { use, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from './Card';
import CardDominos from './CardDominos';
import styles from './Shop.module.css';

function ShowData({ apiEndpoint, shopName }) {
  const [foodItem, setFoodItem] = useState([]);
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({ Category: [], Name: [], });
  const handleFilterChange = (filterName, value) => {
    setSelectedFilters(prev => {
      const isAlreadySelected = prev[filterName].includes(value);

      const updatedValues = isAlreadySelected
        ? prev[filterName].filter(item => item !== value)
        : [...prev[filterName], value];

      return {
        ...prev,
        [filterName]: updatedValues
      };
    });
  };
  const loadData = async () => {
    setLoading(true);
    try {
      let response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      response = await response.json();
      setFoodItem(response[0]);
      setFilters(response[1]);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  const getFilteredData = () => {
    const { Category, Name } = selectedFilters;

    // Step 1: Filter based on categories
    let categoryFilteredData = {};

    const categoriesToFilter =
      Category.length === 0
        ? [...new Set(foodItem.map(item => item.Category))]
        : Category;

    categoriesToFilter.forEach(cat => {
      categoryFilteredData[cat] = foodItem.filter(item => item.Category === cat);
    });

    // Step 2: Apply Name-based filtering within each category group
    if (Name.length > 0) {
      Object.keys(categoryFilteredData).forEach(cat => {
        categoryFilteredData[cat] = categoryFilteredData[cat].filter(item => {
          const itemName = item.Name.toLowerCase();
          return Name.every(filterName => itemName.includes(filterName.toLowerCase()));
        });
      });
    }

    return categoryFilteredData;
  };

  useEffect(() => {
    loadData();
  }, [apiEndpoint]);

  const finalList = getFilteredData();
  return (
    <>
      <Navbar />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(255,255,255,0.7)", zIndex: 9999 }}>
          <div className="spinner-border" style={{width:"3rem",height:"3rem"}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className='container-fluid mt-5'>
          <div className="row">
            <div className={`col-3 ${styles.sidebar}`}>
              <div className='d-flex justify-content-between'>
                <h3>Filters</h3>
                <button type='button' className='btn btn-primary'
                  onClick={() => setSelectedFilters({
                    Category: [],
                    Name: [],
                  })}
                >Reset</button>
              </div>

              {filters.map((filter, filterIndex) => (

                <div key={filterIndex} className="mb-4">
                  <hr />
                  <h5>{filter.filterName}</h5>
                  {filter.values.map((item, itemIndex) => (
                    <div key={itemIndex} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`${filter.filterName}-${item}`}
                        style={{ height: "20px", width: "20px" }}
                        checked={selectedFilters[filter.filterName]?.includes(item)}
                        onChange={() => handleFilterChange(filter.filterName, item)}
                      />
                      <label
                        className="form-check-label fs-5"
                        htmlFor={`${filter.filterName}-${item}`}
                        style={{ marginLeft: "10px" }}
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              ))}

            </div>
            <div className={`col ${styles.main_content}`}>
              <div className='container'>
                {Object.keys(finalList).some(cat => finalList[cat].length > 0) ? (
                  Object.entries(finalList).map(([category, items]) =>
                    items.length > 0 ? (
                      <div key={category} className="mb-5">
                        <h3 className="text-primary mb-3 fs-3">{category}</h3>
                        <div className="row">
                          {items.map((item, index) => (
                            <div className="col" key={index}>
                              {shopName == "dominos" ? (
                                <CardDominos
                                  pid={item._id}
                                  shopname={item.Shop_name}
                                  name={item.Name}
                                  options={item.Options}
                                  imgSrc={item.Image}
                                />
                              ) : (
                                <Card
                                  pid={item._id}
                                  shopname={item.Shop_name}
                                  name={item.Name}
                                  price={item.Price}
                                  imgSrc={item.Image}
                                  quantity={1}
                                  available={item.Available}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )
                ) : (
                  <h4 className="text-danger text-center mt-4">No product available based on your filter.</h4>
                )}

              </div>
            </div>
          </div>
        </div>
      )
      }
      {/* <Footer /> */}
    </>
  );
}

export default ShowData;
