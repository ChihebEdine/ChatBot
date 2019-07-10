import React, { Component } from 'react';
import './Table.css';


class Table extends Component {

    rowCounter = 0;


    render() {
        return (
            <table className='company-table'>
                <thead>
                    <tr>
                        <th className='table-element'>     Name     </th>
                        <th className='table-element'>   Relevance  </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.CompanyList.map(company => {
                        this.rowCounter += 1;
                        return (
                            <tr key={'row-' + this.rowCounter}>
                                <td key={'el1' + this.rowCounter} className='table-element'>{company.name}</td>
                                <td key={'el2' + this.rowCounter} className='table-element'>{company.relevance}</td>
                            </tr>);
                    })}
                </tbody>
            </table>

        )
    }
}


export default Table;
