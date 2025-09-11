import React from 'react'
import './Table.css'

const Table = ({ countries }) => {



    return (
        <div className='table'>

            {/* {country, cases} in this we are using destructuring also when we pass props we are using destructuring*/}
            {countries.map(({ country, cases }) => (

                <tr>
                    <td>{country}</td>
                    <td>
                        <strong>{cases}</strong>
                    </td>
                </tr>
            ))}
        </div>
    )
}

export default Table
