// import Autosuggest, { ItemAdapter } from 'react-bootstrap-autosuggest'
// import { remove as removeDiacritics } from 'diacritics'

const countries = {
  'AD': { name: 'Andorra' },
  // $fold-start$
  'AE': { name: 'United Arab Emirates' },
  'AF': { name: 'Afghanistan' },
  'AG': { name: 'Antigua and Barbuda' },
  'AI': { name: 'Anguilla' },
  'AL': { name: 'Albania' },
  'AM': { name: 'Armenia' },
  'AO': { name: 'Angola' },
  'AQ': { name: 'Antarctica' },
  'AR': { name: 'Argentina' },
  'AS': { name: 'American Samoa' },
  'AT': { name: 'Austria' },
  'AU': { name: 'Australia' },
  'AW': { name: 'Aruba' },
  'AX': { name: 'Åland Islands' },
  'AZ': { name: 'Azerbaijan' },
  'BA': { name: 'Bosnia and Herzegovina' },
  'BB': { name: 'Barbados' },
  'BD': { name: 'Bangladesh' },
  'BE': { name: 'Belgium' },
  'BF': { name: 'Burkina Faso' },
  'BG': { name: 'Bulgaria' },
  'BH': { name: 'Bahrain' },
  'BI': { name: 'Burundi' },
  'BJ': { name: 'Benin' },
  'BL': { name: 'Saint-Barthélemy' },
  'BM': { name: 'Bermuda' },
  'BN': { name: 'Brunei Darussalam' },
  'BO': { name: 'Bolivia' },
  'BQ': { name: 'Bonaire, Sint Eustatius and Saba' },
  'BR': { name: 'Brazil' },
  'BS': { name: 'Bahamas' },
  'BT': { name: 'Bhutan' },
  'BV': { name: 'Bouvet Island' },
  'BW': { name: 'Botswana' },
  'BY': { name: 'Belarus' },
  'BZ': { name: 'Belize' },
  'CA': { name: 'Canada' },
  'CC': { name: 'Cocos (Keeling) Islands' },
  'CD': { name: 'Congo (Democratic Republic of the)' },
  'CF': { name: 'Central African Republic' },
  'CG': { name: 'Congo' },
  'CH': { name: 'Switzerland' },
  'CI': { name: 'Côte d\'Ivoire' },
  'CK': { name: 'Cook Islands' },
  'CL': { name: 'Chile' },
  'CM': { name: 'Cameroon' },
  'CN': { name: 'China' },
  'CO': { name: 'Colombia' },
  'CR': { name: 'Costa Rica' },
  'CU': { name: 'Cuba' },
  'CV': { name: 'Cape Verde' },
  'CW': { name: 'Curaçao' },
  'CX': { name: 'Christmas Island' },
  'CY': { name: 'Cyprus' },
  'CZ': { name: 'Czech Republic' },
  'DE': { name: 'Germany' },
  'DJ': { name: 'Djibouti' },
  'DK': { name: 'Denmark' },
  'DM': { name: 'Dominica' },
  'DO': { name: 'Dominican Republic' },
  'DZ': { name: 'Algeria' },
  'EC': { name: 'Ecuador' },
  'EE': { name: 'Estonia' },
  'EG': { name: 'Egypt' },
  'EH': { name: 'Western Sahara' },
  'ER': { name: 'Eritrea' },
  'ES': { name: 'Spain' },
  'ET': { name: 'Ethiopia' },
  'FI': { name: 'Finland' },
  'FJ': { name: 'Fiji' },
  'FK': { name: 'Falkland Islands (Malvinas)' },
  'FM': { name: 'Federated States of Micronesia' },
  'FO': { name: 'Faeroe Islands' },
  'FR': { name: 'France' },
  'GA': { name: 'Gabon' },
  'GB': { name: 'United Kingdom' },
  'GD': { name: 'Grenada' },
  'GE': { name: 'Georgia' },
  'GF': { name: 'French Guiana' },
  'GG': { name: 'Guernsey' },
  'GH': { name: 'Ghana' },
  'GI': { name: 'Gibraltar' },
  'GL': { name: 'Greenland' },
  'GM': { name: 'Gambia' },
  'GN': { name: 'Guinea' },
  'GP': { name: 'Guadeloupe' },
  'GQ': { name: 'Equatorial Guinea' },
  'GR': { name: 'Greece' },
  'GS': { name: 'South Georgia and the South Sandwich Islands' },
  'GT': { name: 'Guatemala' },
  'GU': { name: 'Guam' },
  'GW': { name: 'Guinea-Bissau' },
  'GY': { name: 'Guyana' },
  'HK': { name: 'Hong Kong' },
  'HM': { name: 'Heard Island and McDonald Islands' },
  'HN': { name: 'Honduras' },
  'HR': { name: 'Croatia' },
  'HT': { name: 'Haiti' },
  'HU': { name: 'Hungary' },
  'ID': { name: 'Indonesia' },
  'IE': { name: 'Ireland' },
  'IL': { name: 'Israel' },
  'IM': { name: 'Isle of Man' },
  'IN': { name: 'India' },
  'IO': { name: 'British Indian Ocean Territory' },
  'IQ': { name: 'Iraq' },
  'IR': { name: 'Iran' },
  'IS': { name: 'Iceland' },
  'IT': { name: 'Italy' },
  'JE': { name: 'Jersey' },
  'JM': { name: 'Jamaica' },
  'JO': { name: 'Jordan' },
  'JP': { name: 'Japan' },
  'KE': { name: 'Kenya' },
  'KG': { name: 'Kyrgyzstan' },
  'KH': { name: 'Cambodia' },
  'KI': { name: 'Kiribati' },
  'KM': { name: 'Comoros' },
  'KN': { name: 'Saint Kitts and Nevis' },
  'KP': { name: 'Korea (Democratic People\'s Republic of)' },
  'KR': { name: 'Korea (Republic of)' },
  'KW': { name: 'Kuwait' },
  'KY': { name: 'Cayman Islands' },
  'KZ': { name: 'Kazakhstan' },
  'LA': { name: 'Lao People\'s Democratic Republic' },
  'LB': { name: 'Lebanon' },
  'LC': { name: 'Saint Lucia' },
  'LI': { name: 'Liechtenstein' },
  'LK': { name: 'Sri Lanka' },
  'LR': { name: 'Liberia' },
  'LS': { name: 'Lesotho' },
  'LT': { name: 'Lithuania' },
  'LU': { name: 'Luxembourg' },
  'LV': { name: 'Latvia' },
  'LY': { name: 'Libya' },
  'MA': { name: 'Morocco' },
  'MC': { name: 'Monaco' },
  'MD': { name: 'Moldova' },
  'ME': { name: 'Montenegro' },
  'MF': { name: 'Saint-Martin (French part)' },
  'MG': { name: 'Madagascar' },
  'MH': { name: 'Marshall Islands' },
  'MK': { name: 'Macedonia (The Former Yugoslav Republic of)' },
  'ML': { name: 'Mali' },
  'MM': { name: 'Myanmar' },
  'MN': { name: 'Mongolia' },
  'MO': { name: 'Macao' },
  'MP': { name: 'Northern Mariana Islands' },
  'MQ': { name: 'Martinique' },
  'MR': { name: 'Mauritania' },
  'MS': { name: 'Montserrat' },
  'MT': { name: 'Malta' },
  'MU': { name: 'Mauritius' },
  'MV': { name: 'Maldives' },
  'MW': { name: 'Malawi' },
  'MX': { name: 'Mexico' },
  'MY': { name: 'Malaysia' },
  'MZ': { name: 'Mozambique' },
  'NA': { name: 'Namibia' },
  'NC': { name: 'New Caledonia' },
  'NE': { name: 'Niger' },
  'NF': { name: 'Norfolk Island' },
  'NG': { name: 'Nigeria' },
  'NI': { name: 'Nicaragua' },
  'NL': { name: 'Netherlands' },
  'NO': { name: 'Norway' },
  'NP': { name: 'Nepal' },
  'NR': { name: 'Nauru' },
  'NU': { name: 'Niue' },
  'NZ': { name: 'New Zealand' },
  'OM': { name: 'Oman' },
  'PA': { name: 'Panama' },
  'PE': { name: 'Peru' },
  'PF': { name: 'French Polynesia' },
  'PG': { name: 'Papua New Guinea' },
  'PH': { name: 'Philippines' },
  'PK': { name: 'Pakistan' },
  'PL': { name: 'Poland' },
  'PM': { name: 'Saint Pierre and Miquelon' },
  'PN': { name: 'Pitcairn' },
  'PR': { name: 'Puerto Rico' },
  'PS': { name: 'Occupied Palestinian Territory' },
  'PT': { name: 'Portugal' },
  'PW': { name: 'Palau' },
  'PY': { name: 'Paraguay' },
  'QA': { name: 'Qatar' },
  'RE': { name: 'Réunion' },
  'RO': { name: 'Romania' },
  'RS': { name: 'Serbia' },
  'RU': { name: 'Russian Federation' },
  'RW': { name: 'Rwanda' },
  'SA': { name: 'Saudi Arabia' },
  'SB': { name: 'Solomon Islands' },
  'SC': { name: 'Seychelles' },
  'SD': { name: 'Sudan' },
  'SE': { name: 'Sweden' },
  'SG': { name: 'Singapore' },
  'SH': { name: 'Saint Helena' },
  'SI': { name: 'Slovenia' },
  'SJ': { name: 'Svalbard and Jan Mayen Islands' },
  'SK': { name: 'Slovakia' },
  'SL': { name: 'Sierra Leone' },
  'SM': { name: 'San Marino' },
  'SN': { name: 'Senegal' },
  'SO': { name: 'Somalia' },
  'SR': { name: 'Suriname' },
  'SS': { name: 'South Sudan' },
  'ST': { name: 'Sao Tome and Principe' },
  'SV': { name: 'El Salvador' },
  'SX': { name: 'Sint Maarten (Dutch part)' },
  'SY': { name: 'Syrian Arab Republic' },
  'SZ': { name: 'Swaziland' },
  'TC': { name: 'Turks and Caicos Islands' },
  'TD': { name: 'Chad' },
  'TF': { name: 'French Southern Territories' },
  'TG': { name: 'Togo' },
  'TH': { name: 'Thailand' },
  'TJ': { name: 'Tajikistan' },
  'TK': { name: 'Tokelau' },
  'TL': { name: 'Timor-Leste' },
  'TM': { name: 'Turkmenistan' },
  'TN': { name: 'Tunisia' },
  'TO': { name: 'Tonga' },
  'TR': { name: 'Turkey' },
  'TT': { name: 'Trinidad and Tobago' },
  'TV': { name: 'Tuvalu' },
  'TW': { name: 'Taiwan' },
  'TZ': { name: 'Tanzania (United Republic of)' },
  'UA': { name: 'Ukraine' },
  'UG': { name: 'Uganda' },
  'US': { name: 'United States' },
  'UY': { name: 'Uruguay' },
  'UZ': { name: 'Uzbekistan' },
  'VA': { name: 'Holy See (Vatican City)' },
  'VC': { name: 'Saint Vincent and the Grenadines' },
  'VE': { name: 'Venezuela' },
  'VG': { name: 'British Virgin Islands' },
  'VN': { name: 'Vietnam' },
  'VU': { name: 'Vanuatu' },
  'WF': { name: 'Wallis and Futuna Islands' },
  'WS': { name: 'Samoa' },
  'XK': { name: 'Kosovo' },
  'YE': { name: 'Yemen' },
  'YT': { name: 'Mayotte' },
  'ZA': { name: 'South Africa' },
  'ZM': { name: 'Zambia' },
  // $fold-end$
  'ZW': { name: 'Zimbabwe' }
}

// use fixed sort order for a subset of values
countries.US.sortKey = '1'
countries.CA.sortKey = '2'

// remove diacritics in folded values, so that names like "Åland Islands"
// are found and sort with "a"
function foldValue(value: string): string {
  return removeDiacritics(value).toLowerCase()
}

// fold names in advance, since it is a relatively expensive operation
for (let code of Object.keys(countries)) {
  const country = countries[code]
  const name = country.name
  country.foldedName = foldValue(name)
  if (!country.sortKey) {
    country.sortKey = country.foldedName
  }
}

class CountryAdapter extends ItemAdapter {
  getTextRepresentations(item) {
    return [item.key.toLowerCase(), item.foldedName]
  }
  foldValue(value) {
    return foldValue(value)
  }
  renderItem(item) {
    return <div>{item.name}<span className="abbrev">{item.key}</span></div>
  }
}
CountryAdapter.instance = new CountryAdapter()

return function render({ country, onChange }) {
  return <FormGroup controlId="countryInput">
    <div className="pull-right">
      <small>
        {country && country.key && `Country code: ${country.key}`}
      </small>
    </div>
    <ControlLabel>Country</ControlLabel>
    <Autosuggest
      datalist={countries}
      datalistOnly
      placeholder="Pick a country..."
      value={country}
      valueIsItem
      itemAdapter={CountryAdapter.instance}
      itemValuePropName="name"
      onChange={onChange} />
  </FormGroup>
}
