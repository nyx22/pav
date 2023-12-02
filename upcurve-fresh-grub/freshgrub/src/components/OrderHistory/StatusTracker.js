import React from "react";
import "./StatusTracker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClock,
  faHamburger,
} from "@fortawesome/free-solid-svg-icons";

const StatusTracker = ({ orderStatus }) => {
  const statuses = ["Accepted", "Preparing", "Ready"];
  const icons = [faCheckCircle, faClock, faHamburger];
  const colors = ["dimgray", "dimgray", "dimgray"]; // Set all statuses to gray initially
  const isOrderTaken = orderStatus === "Order Delivered";
  const isReady = orderStatus === "Ready";

  // Set colors for each status if not "Order Taken"
  if (!isOrderTaken) {
    const currentIndex = statuses.indexOf(orderStatus);
    colors.fill("green", 0, currentIndex + 1);
  }

  return (
    <div className="status-tracker">
      {!isOrderTaken ? (
        <>
          {statuses.map((status, index) => (
            <React.Fragment key={status}>
              <div
                className={`status-step ${
                  orderStatus === status ? "current" : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={icons[index]}
                  style={{
                    fontSize: "20px",
                    color: colors[index],
                  }}
                />
                <span
                  style={{
                    color: colors[index],
                  }}
                >
                  {status}
                </span>
              </div>
              {index < statuses.length - 1 && (
                <div className={`status-arrow`}>→</div>
              )}
            </React.Fragment>
          ))}
        </>
      ) : (
        <div className="status-label"> 🎉 Received </div>
      )}
    </div>
  );
};

export default StatusTracker;