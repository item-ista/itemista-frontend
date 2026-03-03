import { useState, useEffect, useRef } from 'react';
import { ChevronRight, MapPin, Search, X } from 'lucide-react';
import './AddressSelector.css';

// Pakistan Location Data
const locationData = {
  provinces: [
    { id: 'sindh', name: 'Sindh' },
    { id: 'punjab', name: 'Punjab' },
    { id: 'kpk', name: 'Khyber Pakhtunkhwa' },
    { id: 'balochistan', name: 'Balochistan' },
    { id: 'islamabad', name: 'Islamabad Capital Territory' },
  ],
  cities: {
    sindh: [
      { id: 'karachi', name: 'Karachi' },
      { id: 'hyderabad', name: 'Hyderabad' },
      { id: 'sukkur', name: 'Sukkur' },
      { id: 'larkana', name: 'Larkana' },
      { id: 'nawabshah', name: 'Nawabshah' },
    ],
    punjab: [
      { id: 'lahore', name: 'Lahore' },
      { id: 'faisalabad', name: 'Faisalabad' },
      { id: 'rawalpindi', name: 'Rawalpindi' },
      { id: 'multan', name: 'Multan' },
      { id: 'gujranwala', name: 'Gujranwala' },
    ],
    kpk: [
      { id: 'peshawar', name: 'Peshawar' },
      { id: 'abbottabad', name: 'Abbottabad' },
      { id: 'mardan', name: 'Mardan' },
      { id: 'swat', name: 'Swat' },
    ],
    balochistan: [
      { id: 'quetta', name: 'Quetta' },
      { id: 'gwadar', name: 'Gwadar' },
      { id: 'turbat', name: 'Turbat' },
    ],
    islamabad: [
      { id: 'islamabad', name: 'Islamabad' },
    ],
  },
  areas: {
    karachi: [
      { id: 'gulistan-e-johar', name: 'Gulistan-e-Johar' },
      { id: 'gulshan-e-iqbal', name: 'Gulshan-e-Iqbal' },
      { id: 'gulshan-e-hadeed', name: 'Gulshan-e-Hadeed' },
      { id: 'gulshan-e-maymar', name: 'Gulshan-e-Maymar' },
      { id: 'dha', name: 'DHA Defence' },
      { id: 'clifton', name: 'Clifton' },
      { id: 'korangi', name: 'Korangi' },
      { id: 'malir', name: 'Malir' },
      { id: 'saddar', name: 'Saddar' },
      { id: 'nazimabad', name: 'Nazimabad' },
      { id: 'north-nazimabad', name: 'North Nazimabad' },
      { id: 'liaquatabad', name: 'Liaquatabad' },
      { id: 'fb-area', name: 'F.B. Area' },
      { id: 'north-karachi', name: 'North Karachi' },
      { id: 'scheme-33', name: 'Scheme 33' },
      { id: 'bahria-town', name: 'Bahria Town' },
      { id: 'shah-faisal', name: 'Shah Faisal Colony' },
      { id: 'landhi', name: 'Landhi' },
      { id: 'orangi', name: 'Orangi Town' },
      { id: 'baldia', name: 'Baldia Town' },
      { id: 'site', name: 'SITE Area' },
      { id: 'keamari', name: 'Keamari' },
      { id: 'lyari', name: 'Lyari' },
      { id: 'garden', name: 'Garden' },
      { id: 'pechs', name: 'PECHS' },
      { id: 'tariq-road', name: 'Tariq Road' },
      { id: 'bahadurabad', name: 'Bahadurabad' },
      { id: 'abyssinia-lines', name: 'Abyssinia Lines' },
      { id: 'akhter-colony', name: 'Akhter Colony' },
      { id: 'askari', name: 'Askari' },
    ],
    lahore: [
      { id: 'dha-lahore', name: 'DHA' },
      { id: 'gulberg', name: 'Gulberg' },
      { id: 'model-town', name: 'Model Town' },
      { id: 'johar-town', name: 'Johar Town' },
      { id: 'bahria-town-lahore', name: 'Bahria Town' },
      { id: 'cantt', name: 'Cantt' },
      { id: 'garden-town', name: 'Garden Town' },
      { id: 'iqbal-town', name: 'Iqbal Town' },
      { id: 'township', name: 'Township' },
      { id: 'wapda-town', name: 'Wapda Town' },
    ],
    hyderabad: [
      { id: 'latifabad', name: 'Latifabad' },
      { id: 'qasimabad', name: 'Qasimabad' },
      { id: 'city-gate', name: 'City Gate' },
    ],
    peshawar: [
      { id: 'hayatabad', name: 'Hayatabad' },
      { id: 'university-town', name: 'University Town' },
      { id: 'saddar-peshawar', name: 'Saddar' },
    ],
    islamabad: [
      { id: 'f-sectors', name: 'F Sectors' },
      { id: 'g-sectors', name: 'G Sectors' },
      { id: 'i-sectors', name: 'I Sectors' },
      { id: 'e-sectors', name: 'E Sectors' },
      { id: 'bahria-isb', name: 'Bahria Town' },
      { id: 'dha-isb', name: 'DHA' },
    ],
    rawalpindi: [
      { id: 'saddar-rwp', name: 'Saddar' },
      { id: 'bahria-rwp', name: 'Bahria Town' },
      { id: 'satellite-town', name: 'Satellite Town' },
    ],
    quetta: [
      { id: 'cantt-quetta', name: 'Cantt' },
      { id: 'satellite-quetta', name: 'Satellite Town' },
    ],
  },
  blocks: {
    'gulistan-e-johar': [
      { id: 'block-1', name: 'Block 1' },
      { id: 'block-2', name: 'Block 2' },
      { id: 'block-3', name: 'Block 3' },
      { id: 'block-4', name: 'Block 4' },
      { id: 'block-5', name: 'Block 5' },
      { id: 'block-6', name: 'Block 6' },
      { id: 'block-7', name: 'Block 7' },
      { id: 'block-8', name: 'Block 8' },
      { id: 'block-9', name: 'Block 9' },
      { id: 'block-10', name: 'Block 10' },
      { id: 'block-11', name: 'Block 11' },
      { id: 'block-12', name: 'Block 12' },
      { id: 'block-13', name: 'Block 13' },
      { id: 'block-14', name: 'Block 14' },
      { id: 'block-15', name: 'Block 15' },
      { id: 'block-16', name: 'Block 16' },
      { id: 'block-17', name: 'Block 17' },
      { id: 'block-18', name: 'Block 18' },
      { id: 'block-19', name: 'Block 19' },
    ],
    'gulshan-e-iqbal': [
      { id: 'block-1-gi', name: 'Block 1' },
      { id: 'block-2-gi', name: 'Block 2' },
      { id: 'block-3-gi', name: 'Block 3' },
      { id: 'block-4-gi', name: 'Block 4' },
      { id: 'block-5-gi', name: 'Block 5' },
      { id: 'block-6-gi', name: 'Block 6' },
      { id: 'block-7-gi', name: 'Block 7' },
      { id: 'block-8-gi', name: 'Block 8' },
      { id: 'block-9-gi', name: 'Block 9' },
      { id: 'block-10-gi', name: 'Block 10' },
      { id: 'block-11-gi', name: 'Block 11' },
      { id: 'block-12-gi', name: 'Block 12' },
      { id: 'block-13-gi', name: 'Block 13' },
    ],
    'dha': [
      { id: 'phase-1', name: 'Phase 1' },
      { id: 'phase-2', name: 'Phase 2' },
      { id: 'phase-3', name: 'Phase 3' },
      { id: 'phase-4', name: 'Phase 4' },
      { id: 'phase-5', name: 'Phase 5' },
      { id: 'phase-6', name: 'Phase 6' },
      { id: 'phase-7', name: 'Phase 7' },
      { id: 'phase-8', name: 'Phase 8' },
    ],
    'korangi': [
      { id: 'sector-31', name: 'Sector 31' },
      { id: 'sector-32', name: 'Sector 32' },
      { id: 'sector-33', name: 'Sector 33' },
      { id: 'sector-34', name: 'Sector 34' },
      { id: 'sector-35', name: 'Sector 35' },
      { id: 'nasir-colony', name: 'Nasir Colony' },
      { id: 'paf-base', name: 'PAF Base Korangi Creek' },
      { id: 'sector-9', name: 'Sector 9' },
      { id: 'sector-10', name: 'Sector 10' },
      { id: 'zaman-town', name: 'Zaman Town' },
      { id: 'zia-colony', name: 'Zia Colony' },
    ],
    'clifton': [
      { id: 'block-1-cl', name: 'Block 1' },
      { id: 'block-2-cl', name: 'Block 2' },
      { id: 'block-3-cl', name: 'Block 3' },
      { id: 'block-4-cl', name: 'Block 4' },
      { id: 'block-5-cl', name: 'Block 5' },
      { id: 'block-6-cl', name: 'Block 6' },
      { id: 'block-7-cl', name: 'Block 7' },
      { id: 'block-8-cl', name: 'Block 8' },
      { id: 'block-9-cl', name: 'Block 9' },
    ],
    'north-nazimabad': [
      { id: 'block-a-nn', name: 'Block A' },
      { id: 'block-b-nn', name: 'Block B' },
      { id: 'block-c-nn', name: 'Block C' },
      { id: 'block-d-nn', name: 'Block D' },
      { id: 'block-e-nn', name: 'Block E' },
      { id: 'block-f-nn', name: 'Block F' },
      { id: 'block-g-nn', name: 'Block G' },
      { id: 'block-h-nn', name: 'Block H' },
      { id: 'block-i-nn', name: 'Block I' },
      { id: 'block-j-nn', name: 'Block J' },
      { id: 'block-k-nn', name: 'Block K' },
      { id: 'block-l-nn', name: 'Block L' },
      { id: 'block-m-nn', name: 'Block M' },
      { id: 'block-n-nn', name: 'Block N' },
    ],
    'bahria-town': [
      { id: 'precinct-1', name: 'Precinct 1' },
      { id: 'precinct-2', name: 'Precinct 2' },
      { id: 'precinct-3', name: 'Precinct 3' },
      { id: 'precinct-4', name: 'Precinct 4' },
      { id: 'precinct-5', name: 'Precinct 5' },
      { id: 'precinct-6', name: 'Precinct 6' },
      { id: 'precinct-7', name: 'Precinct 7' },
      { id: 'precinct-8', name: 'Precinct 8' },
      { id: 'precinct-9', name: 'Precinct 9' },
      { id: 'precinct-10', name: 'Precinct 10' },
    ],
    'malir': [
      { id: 'malir-halt', name: 'Malir Halt' },
      { id: 'malir-cantt', name: 'Malir Cantt' },
      { id: 'malir-city', name: 'Malir City' },
      { id: 'model-colony', name: 'Model Colony' },
      { id: 'kala-board', name: 'Kala Board' },
    ],
    'nazimabad': [
      { id: 'block-1-nz', name: 'Block 1' },
      { id: 'block-2-nz', name: 'Block 2' },
      { id: 'block-3-nz', name: 'Block 3' },
      { id: 'block-4-nz', name: 'Block 4' },
      { id: 'block-5-nz', name: 'Block 5' },
    ],
    'fb-area': [
      { id: 'block-1-fb', name: 'Block 1' },
      { id: 'block-2-fb', name: 'Block 2' },
      { id: 'block-3-fb', name: 'Block 3' },
      { id: 'block-4-fb', name: 'Block 4' },
      { id: 'block-5-fb', name: 'Block 5' },
      { id: 'block-6-fb', name: 'Block 6' },
      { id: 'block-7-fb', name: 'Block 7' },
      { id: 'block-8-fb', name: 'Block 8' },
      { id: 'block-9-fb', name: 'Block 9' },
      { id: 'block-10-fb', name: 'Block 10' },
      { id: 'block-11-fb', name: 'Block 11' },
      { id: 'block-12-fb', name: 'Block 12' },
      { id: 'block-13-fb', name: 'Block 13' },
      { id: 'block-14-fb', name: 'Block 14' },
      { id: 'block-15-fb', name: 'Block 15' },
      { id: 'block-16-fb', name: 'Block 16' },
      { id: 'block-17-fb', name: 'Block 17' },
      { id: 'block-18-fb', name: 'Block 18' },
      { id: 'block-19-fb', name: 'Block 19' },
      { id: 'block-20-fb', name: 'Block 20' },
      { id: 'block-21-fb', name: 'Block 21' },
    ],
    'north-karachi': [
      { id: 'sector-5a-nk', name: 'Sector 5-A' },
      { id: 'sector-5b-nk', name: 'Sector 5-B' },
      { id: 'sector-5c-nk', name: 'Sector 5-C' },
      { id: 'sector-5d-nk', name: 'Sector 5-D' },
      { id: 'sector-5e-nk', name: 'Sector 5-E' },
      { id: 'sector-5f-nk', name: 'Sector 5-F' },
      { id: 'sector-5g-nk', name: 'Sector 5-G' },
      { id: 'sector-5h-nk', name: 'Sector 5-H' },
      { id: 'sector-7-nk', name: 'Sector 7' },
      { id: 'sector-9-nk', name: 'Sector 9' },
      { id: 'sector-10-nk', name: 'Sector 10' },
      { id: 'sector-11a-nk', name: 'Sector 11-A' },
      { id: 'sector-11b-nk', name: 'Sector 11-B' },
      { id: 'sector-11c-nk', name: 'Sector 11-C' },
      { id: 'sector-11d-nk', name: 'Sector 11-D' },
      { id: 'sector-11e-nk', name: 'Sector 11-E' },
      { id: 'sector-11f-nk', name: 'Sector 11-F' },
      { id: 'sector-11g-nk', name: 'Sector 11-G' },
      { id: 'sector-11h-nk', name: 'Sector 11-H' },
      { id: 'sector-11i-nk', name: 'Sector 11-I' },
      { id: 'sector-11j-nk', name: 'Sector 11-J' },
      { id: 'sector-11k-nk', name: 'Sector 11-K' },
      { id: 'sector-11l-nk', name: 'Sector 11-L' },
      { id: 'sector-14-nk', name: 'Sector 14' },
      { id: 'sector-15-nk', name: 'Sector 15' },
    ],
    'pechs': [
      { id: 'block-1-pechs', name: 'Block 1' },
      { id: 'block-2-pechs', name: 'Block 2' },
      { id: 'block-3-pechs', name: 'Block 3' },
      { id: 'block-4-pechs', name: 'Block 4' },
      { id: 'block-5-pechs', name: 'Block 5' },
      { id: 'block-6-pechs', name: 'Block 6' },
    ],
  }
};

const AddressSelector = ({ currentAddress, onAddressChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Province, 2: City, 3: Area, 4: Block
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setSelectedCity(null);
    setSelectedArea(null);
    setSelectedBlock(null);
    setSearchQuery('');
    setStep(2);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedArea(null);
    setSelectedBlock(null);
    setSearchQuery('');
    setStep(3);
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setSelectedBlock(null);
    setSearchQuery('');
    // Check if blocks exist for this area
    if (locationData.blocks[area.id]) {
      setStep(4);
    } else {
      // No blocks, finalize selection
      finalizeSelection(area, null);
    }
  };

  const handleBlockSelect = (block) => {
    setSelectedBlock(block);
    finalizeSelection(selectedArea, block);
  };

  const finalizeSelection = (area, block) => {
    const fullAddress = `${selectedProvince.name}, ${selectedCity.name} - ${area.name}${block ? `, ${block.name}` : ''}`;
    onAddressChange && onAddressChange({
      province: selectedProvince,
      city: selectedCity,
      area: area,
      block: block,
      fullAddress
    });
    setIsOpen(false);
    resetSelection();
  };

  const resetSelection = () => {
    setStep(1);
    setSearchQuery('');
  };

  const goBack = () => {
    if (step === 4) {
      setSelectedBlock(null);
      setStep(3);
    } else if (step === 3) {
      setSelectedArea(null);
      setStep(2);
    } else if (step === 2) {
      setSelectedCity(null);
      setStep(1);
    }
    setSearchQuery('');
  };

  const getCurrentList = () => {
    let list = [];
    switch (step) {
      case 1:
        list = locationData.provinces;
        break;
      case 2:
        list = selectedProvince ? locationData.cities[selectedProvince.id] || [] : [];
        break;
      case 3:
        list = selectedCity ? locationData.areas[selectedCity.id] || [] : [];
        break;
      case 4:
        list = selectedArea ? locationData.blocks[selectedArea.id] || [] : [];
        break;
      default:
        list = [];
    }

    // Filter by search
    if (searchQuery) {
      list = list.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return list;
  };

  const getPlaceholder = () => {
    switch (step) {
      case 1: return 'Search Province';
      case 2: return 'Search City';
      case 3: return 'Search Area';
      case 4: return 'Search Block/Sector';
      default: return 'Search';
    }
  };

  const getBreadcrumb = () => {
    const parts = [];
    if (selectedProvince) parts.push(selectedProvince.name);
    if (selectedCity) parts.push(selectedCity.name);
    if (selectedArea) parts.push(selectedArea.name);
    
    const stepLabel = step === 1 ? 'Select Province' : 
                      step === 2 ? 'Select City' :
                      step === 3 ? 'Select Area' : 
                      'Select Block';
    
    return { parts, stepLabel };
  };

  const handleItemClick = (item) => {
    switch (step) {
      case 1:
        handleProvinceSelect(item);
        break;
      case 2:
        handleCitySelect(item);
        break;
      case 3:
        handleAreaSelect(item);
        break;
      case 4:
        handleBlockSelect(item);
        break;
    }
  };

  const { parts, stepLabel } = getBreadcrumb();

  return (
    <div className="address-selector" ref={dropdownRef}>
      <div className="current-address">
        <MapPin size={16} className="address-icon" />
        <span className="address-text">{currentAddress}</span>
        <button 
          className="change-btn"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) resetSelection();
          }}
        >
          CHANGE
        </button>
      </div>

      {isOpen && (
        <div className="address-dropdown">
          {/* Breadcrumb Navigation */}
          <div className="dropdown-breadcrumb">
            {step > 1 && (
              <button className="back-arrow" onClick={goBack}>
                ←
              </button>
            )}
            <div className="breadcrumb-items">
              {parts.map((part, index) => (
                <span key={index} className="breadcrumb-item">
                  {part}
                  <ChevronRight size={14} className="breadcrumb-separator" />
                </span>
              ))}
              <span className="breadcrumb-current">{stepLabel}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Search Input */}
          <div className="dropdown-search">
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Search size={18} className="search-icon" />
          </div>

          {/* Options List */}
          <div className="options-list">
            {getCurrentList().map((item) => (
              <div
                key={item.id}
                className="option-item"
                onClick={() => handleItemClick(item)}
              >
                <span>{item.name}</span>
                {step < 4 && <ChevronRight size={16} className="option-arrow" />}
              </div>
            ))}
            {getCurrentList().length === 0 && (
              <div className="no-results">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;