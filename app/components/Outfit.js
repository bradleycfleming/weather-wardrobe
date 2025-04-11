import React from "react";

const Outfit = (props) => {
  return (
    <div id={props.id} className={props.className}>
      <table className="table">
        {/* head */}
        <thead></thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <th>Top</th>
            <td>T-shirt</td>
          </tr>
          {/* row 2 */}
          <tr>
            <th>Bottom</th>
            <td>Shorts</td>
          </tr>
          <TableLine present={props.formality>2} row="2nd" info="Flannel"></TableLine>

          {/* row 3 */}
          <tr>
            <th>Shoes</th>
            <td>Sneakers</td>
          </tr>



          <TableLine present="true" row="Formality" info={props.formality}></TableLine>

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
