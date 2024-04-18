import React, { useState } from 'react';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';

const TimeConverter = () => {
  const [timezones] = useState([
    { label: 'Indian Standard Time', value: 'Local Time', offset: 5.5, currentTime: new Date().getHours() * 60 + new Date().getMinutes(), checked: true },
    { label: 'New York', value: 'New York', offset: -4, currentTime: (new Date().getUTCHours() - 4) * 60 + new Date().getUTCMinutes(), checked: true },
    { label: 'London', value: 'London', offset: 1, currentTime: (new Date().getUTCHours() + 1) * 60 + new Date().getUTCMinutes(), checked: true },
    { label: 'Tokyo', value: 'Tokyo', offset: 9, currentTime: (new Date().getHours() + 3.5) * 60 + new Date().getUTCMinutes(), checked: true }
    // Add more timezones as needed
  ]);

  const [selectedTimezones, setSelectedTimezones] = useState([]);

  const handleRemove = (index) => {
    const newSelectedTimezones = selectedTimezones.filter((_, i) => i !== index);
    setSelectedTimezones(newSelectedTimezones);
  };

  const handleTimeChange = (index, event) => {
    const newTime = parseInt(event.target.value);
    const newSelectedTimezones = [...selectedTimezones];
    newSelectedTimezones.forEach((timezone, i) => {
      const localTime = selectedTimezones[index].currentTime;
      const offsetDifference = timezone.offset - selectedTimezones[index].offset;
      const adjustedTime = (localTime + (offsetDifference * 60) + newTime - selectedTimezones[index].currentTime + 1440) % 1440;
      newSelectedTimezones[i].currentTime = adjustedTime;
    });
    setSelectedTimezones(newSelectedTimezones);
  };

  const formatTime = (time) => {
    let hours = Math.floor(time / 60);
    let minutes = time % 60;
    let meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${meridiem}`;
  };

  const handleSelect = (selectedOption) => {
    if (selectedOption) {
      const newSelectedTimezones = [...selectedTimezones, timezones.find(timezone => timezone.value === selectedOption.value)];
      setSelectedTimezones(newSelectedTimezones);
    }
  };

  const reverseTimezones = () => {
    setSelectedTimezones([...selectedTimezones].reverse());
  };

  const renderMarks = () => {
    const marks = [
      { value: 0, label: '12am' },
      { value: 180, label: '3am' },
      { value: 360, label: '6am' },
      { value: 540, label: '9am' },
      { value: 720, label: '12pm' },
      { value: 900, label: '3pm' },
      { value: 1080, label: '6pm' },
      { value: 1260, label: '9pm' },
      // { value: 1439, label: '11:59pm' }
    ];

    return marks.map(mark => (
      <span key={mark.value} style={{ position: 'absolute', left: `${(mark.value / 1440) * 100}%`, transform: 'translateX(-50%)', fontSize: '1rem' }}>
        {mark.label}
      </span>
    ));
  };

  const generateShareableLink = () => {
    const formattedTimezones = selectedTimezones.map(zone => ({ ...zone, currentTime: formatTime(zone.currentTime) }));
    const params = new URLSearchParams();
    params.append('timezones', encodeURIComponent(JSON.stringify(formattedTimezones)));
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    alert(`Shareable Link:\n${url}`);
  };
  

  return (
    <div className="container-fluid mt-5">
      <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '30%' }}>
          <Select
            options={timezones.filter(timezone => !selectedTimezones.some(selected => selected.value === timezone.value))}
            onChange={handleSelect}
            placeholder="Select a timezone to add"
          />
        </div>
        <button className="btn btn-primary mb-3" style={{ marginLeft: '10px', marginTop: '16px' }} onClick={reverseTimezones}>Swap Timezones</button>
        <button className="btn btn-primary mb-3" style={{ marginTop: '16px', marginLeft: '10px' }} onClick={generateShareableLink}>Get Shareable Link</button>
      </div>
      {selectedTimezones.map((timezone, index) => (
        <div key={index}>
          <div className="card mb-4" style={{ background: `linear-gradient(45deg, #ffffff,#ADD8E6)` }}>
            <div className="card-body" style={{ padding: '30px' }}>
              <button className="btn btn" onClick={() => handleRemove(index)} style={{color:'red', position: 'absolute', top: '5px', right: '5px'}}>
                <FaTimes /> {/* Render the FaTimes icon */}
              </button><h5 className="card-title">{timezone.label}</h5>
              <input
                type="range"
                min={0}
                max={1439}
                value={timezone.currentTime}
                className="form-range"
                onChange={(event) => handleTimeChange(index, event)}
                style={{ marginBottom: '1rem' }}
              />
              <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
                {renderMarks()}
              </div>
              <h6 className="card-text text-center" style={{marginTop:'50px'}}>Selected Time: {formatTime(timezone.currentTime)}</h6>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeConverter;
