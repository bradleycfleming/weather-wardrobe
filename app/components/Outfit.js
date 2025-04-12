import React, { useState, useEffect } from "react";

const Outfit = (props) => {
  const [top, setTop] = useState("T-shirt");
  const [bottom, setBottom] = useState("Shorts");
  const [second, setSecond] = useState(null);
  const [outerwear, setOuterwear] = useState(null);
  const [hat, setHat] = useState(null);

  const onUpdateOutfit = () => {
    setSecond(null);
    setOuterwear(null);
    setHat(null);

    switch (props.formality) {
      // casual
      case "1":
        setTop("T-shirt");
        setBottom("Shorts");
        if (props.temp < 75) {
          if (props.temp < 60) {
            setSecond("Hoodie");
            setBottom("Sweatpants");
          } else {
            setSecond("Flannel");
          }
        }
        break;

      // casual - daily
      case "2":
        setTop("T-shirt");
        setBottom("Shorts");
        if (props.temp < 75) {
          if (props.temp < 60) {
            setSecond("Hoodie");
            setBottom("Jeans");
          } else {
            setSecond("Flannel");
          }
        }
        break;

      // daily
      case "3":
        setTop("Uniqlo shirt");
        setBottom("Shorts");
        if (props.temp < 75) {
          if (props.temp < 60) {
            setSecond("Sweater");
            setBottom("Jeans");
          } else {
            setSecond("Flannel");
          }
        }
        break;

      // daily - smart
      case "4":
        setTop("Uniqlo shirt");
        setBottom("Khaki shorts");
        if (props.temp < 75) {
          if (props.temp < 60) {
            setSecond("Sweater");
            setBottom("Chinos");
          } else {
            setSecond("Corduroy shirt");
          }
        }
        break;

      // smart
      case "5":
        setTop("Collared shirt");
        setBottom("Chinos");
        if (props.temp < 60) {
          setSecond("Sweater");
        }
        break;
    }

    // determine if a coat is necessary
    if (props.temp < 40) {
      setOuterwear("Coat");
    } else {
      // determine if a rainjacket is necessary
      if (props?.rain && props.rain["1h"] > 0.1) {
        setOuterwear("Rain jacket");
      }
    }

    // determine if a hat is necessary
    if (parseInt(props.formality) < 4) {
      if (props.temp < 40) {
        setHat("Beanie");
      } else {
        if (props?.wind && props.wind?.gust > 20) {
          setHat("Baseball cap");
        }
      }
    }
  };

  useEffect(() => {
    onUpdateOutfit();
  }, [props.formality, props.temp]);

  return (
    <div id={props.id} className={props.className}>
      <table className="table">
        <thead></thead>
        <tbody>
          <tr>
            <th>Top</th>
            <td>{top}</td>
          </tr>
          <tr>
            <th>Bottom</th>
            <td>{bottom}</td>
          </tr>
          <TableLine
            present={second !== null}
            row="2nd"
            info={second}
          ></TableLine>

          <TableLine
            present={outerwear !== null}
            row="Outerwear"
            info={outerwear}
          ></TableLine>

          <TableLine present={hat !== null} row="Hat" info={hat}></TableLine>
        </tbody>
      </table>
    </div>
  );
};

const TableLine = (props) => {
  if (props.present) {
    return (
      <tr>
        <th>{props.row}</th>
        <td>{props.info}</td>
      </tr>
    );
  }
};

export default Outfit;
