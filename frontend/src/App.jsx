import { useEffect, useState } from 'react'
import './App.css'
import { MenuItem, FormControl, Select } from "@mui/material"

function App() {

  const [countries, setCountries] = useState(["India", "China", "Japan"])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((countryData) => ({
            name: countryData.country, // Country full name like India Japan
            value: countryData.countryInfo.iso2 // Country code name like In Ja
          }))
          setCountries(countries)
        })

    }
    getCountriesData()
  },
    [])

  return (
    <>
      <div className='app'>

        <div className="app__header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className='app__dropdown'>
            <Select
              variant="outlined"
              value="abc"
            >

              <MenuItem value="Worldwide"> "Worldwide" </MenuItem>


              {/* Loop THrough all the contries and then show dropdown */}

              {
                countries.map((country) => (
                  <MenuItem value={country.value}> {country.name} </MenuItem>
                ))
              }

              {/* <MenuItem value="worldWide"> worldWide 1</MenuItem>
              
              <MenuItem value="worldWide"> worldWide 3</MenuItem>
              <MenuItem value="worldWide"> worldWide 4</MenuItem> */}


            </Select>
          </FormControl>
        </div>




        {/* Header */}
        {/* title + Select input field */}

        {/* Infomation box */}
        {/* Infomation box */}
        {/* Infomation box */}

        {/* Table */}

        {/* Map */}
      </div>
    </>
  )
}

export default App
