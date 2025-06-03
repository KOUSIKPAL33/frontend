import React from 'react'
import styles from "./body.module.css"

function Body() {
  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <section className="row">
        <div className="col">
          <div className={styles.faster}>More than Faster
            <div className={`${styles.image} align-items-center`}>
              <img src="./image/bodyimage/french-fries.svg" alt="" className={styles.faster_img} />
            </div>
          </div>
          <h1 className={styles.home_h1}>
            Get your cuisine <br />
            delivered right to <br />
            <span style={{ color: " #f94a3d" }}>your door</span>
          </h1>
          <p className={styles.home_p}>
            Food that is delivered at the right time. The trendy food delivery
            partner. Good food is what we deliver. Your hunger companion.
          </p>
          <button className='btn btn-secondary btn-lg'>Explore Food</button>
        </div>
        <div className="col">
          <img src="./image/bodyimage/delivery-guy.svg" alt="" className={styles.home_img} />
        </div>
      </section>

      <section className={styles.service}>
        <div className="row container">
          <div className="col">
            <h2 className={styles.service_h2}>Why we are Best in our Town</h2>
            <p className={styles.service_p}>
              whole grains and low-fat dairy can help to reduce your risk of heart
              disease by maintaining blood pressure and
            </p>
          </div>
          <div className="col">
            <div className={styles.service_card}>
              <img src="./image/bodyimage/meat-icon.svg" alt="" className={styles.service_img} />
              <h3 className={styles.service_h3}>
                Choose <br />
                your favorite <br />
                food
              </h3>
            </div>
          </div>
          <div className="col">
            <div className={styles.service_card}>
              <img src="./image/bodyimage/delivery-icon.svg" alt="" className={styles.service_img} />
              <h3 className={styles.service_h3}>
                Get delivery <br />
                at your door <br />
                step
              </h3>
            </div>
          </div>
          <div className="col">
            <div className={styles.service_card}>
              <img src="./image/bodyimage/phone-icon.svg" alt="" className={styles.service_img} />
              <h3 className={styles.service_h3}>
                We have <br />
                400+ Review <br />
                On our app
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.about}>
        <div className="row container">
          <div className="col">
            <img src="./image/bodyimage/delivery-guy-2.svg" alt="" className={styles.about_img} />
          </div>
          <div className="col">
            <h2 className={styles.about_h2}>Take a look at the benefits we offer for you</h2>
            <p className={styles.about_p}>
              Good service means a friendly, welcoming service. A restaurant owner
              should not merely strive to avoid bad service,
            </p>
            <div className={styles.about_d_grid}>
              <div className={styles.about_card}>
                <img src="./image/bodyimage/car-icon.svg" alt="" />
                <h4 className={styles.about_h4}>Free Home Delivary</h4>
                <span className={styles.about_span}>For all orders</span>
              </div>
              <div className={styles.about_card}>
                <img src="./image/bodyimage/dollar-icon.svg" alt="" />
                <h4 className={styles.about_h4}>Return & Refund</h4>
                <span className={styles.about_span}>Money Back Guarantee</span>
              </div>
              <div className={styles.about_card}>
                <img src="./image/bodyimage/security-icon.svg" alt="" />
                <h4 className={styles.about_h4}>Secure Payment</h4>
                <span className={styles.about_span}>100% Secure Payment</span>
              </div>
              <div className={styles.about_card}>
                <img src="./image/bodyimage/time-icon.svg" alt="" />
                <h4 className={styles.about_h4}>Quality Support</h4>
                <span className={styles.about_span}>Alway Online 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='d-flex justify-content-around p-5 ' style={{backgroundColor:"#f8f8f8"}}>
        <div>
          <h1>1K+</h1>
          <h4>User</h4>
        </div>
        <div>
          <h1>3</h1>
          <h4>Best Shops</h4>
        </div>
        <div>
          <h1>2K+</h1>
          <h4>Food Delivered</h4>
        </div>
      </section>

    </div>
  )
}

export default Body
