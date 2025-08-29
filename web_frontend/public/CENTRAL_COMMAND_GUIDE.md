# CENTRAL COMMAND SCREEN OPERATION GUIDE

## BRIDGE FORMATION CONTROL SYSTEM

### Bridge Strength Monitoring

#### **Primary Bridge Strength Indicator**
**Display Format**: Decimal value 0.00-1.00 with percentage visualization
**Update Rate**: Real-time, 10 Hz refresh for accurate monitoring
**Critical Thresholds**:
- **0.00-0.30**: Bridge formation impossible (Red status)
- **0.30-0.50**: Bridge unstable, transfer not recommended (Yellow status)
- **0.50-0.80**: Bridge stable, safe for transfer (Green status)
- **0.80-1.00**: Optimal bridge strength (Bright Green status)

**Calculation Algorithm**:
```
Bridge_Strength = weighted_average(
    frequency_synchronization_factor,    // 30% weight
    energy_balance_factor,              // 25% weight
    stability_product_factor,           // 25% weight
    environmental_safety_factor         // 20% weight
)
```

#### **Visual Bridge Status Indicator**
**Active Bridge (🌀)**: Displayed when bridge strength ≥0.5
- Animated swirl icon indicating active energy flow
- Color intensity proportional to bridge strength
- Rotation speed indicates energy transfer rate

**Inactive Bridge (⭕)**: Displayed when bridge strength <0.5
- Static circle indicating no bridge connection
- Red color indicates bridge formation failure
- No animation when bridge is inactive

### Transfer Energy Management

#### **Available Transfer Energy Display**
**Purpose**: Shows energy available for matter transfer operations
**Calculation**: min(Portal1_Energy, Portal2_Energy) × Bridge_Strength × Safety_Factor
**Safety Factor**: 0.8 (reserves 20% energy for bridge maintenance)
**Format**: "XXXX.X J" with single decimal precision

**Energy Allocation**:
- **Bridge Maintenance**: 20% of available energy
- **Transfer Operation**: 80% of available energy
- **Emergency Reserve**: Additional 10% held in system capacitors

#### **Energy Transfer Rate**
**Standard Rate**: 100 J/second for small objects (<10 kg)
**Heavy Object Rate**: 50 J/second for objects >50 kg
**Large Volume Rate**: 25 J/second for objects >0.5 m³
**Formula**: Rate = Base_Rate / (Mass_Factor × Volume_Factor)

### Frequency Synchronization Control

#### **Detune (Delta f) Monitor**
**Purpose**: Displays frequency difference between portals
**Format**: "X.XXXX Hz" with four decimal precision
**Critical Requirement**: Δf < 0.001 Hz for bridge formation
**Optimal Target**: Δf < 0.0001 Hz for maximum bridge strength

**Synchronization Process**:
1. **Coarse Adjustment**: Bring frequencies within 0.01 Hz
2. **Fine Tuning**: Adjust to within 0.001 Hz
3. **Precision Lock**: Achieve <0.0001 Hz difference
4. **Maintenance**: Continuous micro-adjustments during operation

#### **Automatic Synchronization System**
**Enabled**: When both portals are stable (stability >0.3)
**Process**: Gradual frequency adjustment over 5-10 seconds
**Tolerance**: Maintains synchronization within ±0.0005 Hz
**Override**: Manual frequency control disables auto-sync

## PORTAL STATUS SUMMARY PANEL

### Frequency and Stability Readout

#### **Portal 1 Status Display**
**Format**: "XX.XX Hz / X.XX" (Frequency / Stability)
**Color Coding**:
- **Green**: Both parameters in optimal range
- **Yellow**: One parameter approaching limits
- **Red**: Either parameter in critical range

#### **Portal 2 Status Display**
**Format**: Identical to Portal 1 for easy comparison
**Synchronization Indicator**: Visual highlight when frequencies match
**Stability Comparison**: Side-by-side stability values for balance assessment

### Safety Status Grid

#### **Individual Portal Safety (S1/S2)**
**Monitoring Parameters**:
- Temperature thresholds (<40°C)
- Energy level limits (<18,000 J)
- Frequency bounds (20-50 Hz)
- Field stability (>0.1)
- Grounding status (TRUE)

**Status Indicators**:
- **Green Dot + "OK"**: All safety parameters normal
- **Red Dot + "FAIL"**: One or more safety violations
- **Pulsing Animation**: Indicates active safety monitoring

#### **Bridge Safety Status (BR)**
**ACTIVE**: Bridge strength ≥0.5, all safety checks passed
**INACTIVE**: Bridge strength <0.5 or safety violation detected
**EMERGENCY**: Critical safety failure, immediate shutdown required

## CONTROL BUTTON OPERATIONS

### Form Bridge Button

#### **Function**: Initiates bridge formation sequence
**Prerequisites**:
- Both portals stable (stability >0.3)
- Frequencies synchronized (Δf <0.001 Hz)
- No safety violations on either portal
- Minimum energy levels (>1,000 J each portal)

**Process Sequence**:
1. **Pre-check**: Verify all prerequisites met
2. **Field Alignment**: Gradual synchronization of portal fields
3. **Bridge Establishment**: Energy bridge formation over 2-3 seconds
4. **Stability Verification**: Confirm bridge strength >0.5
5. **Ready State**: Bridge available for transfer operations

**Feedback**:
- **Success**: Bridge strength indicator updates, visual status changes
- **Failure**: Error message in event log, specific failure reason
- **Partial**: Bridge forms but with low strength (<0.5)

### Transfer Payload Button

#### **Function**: Transfers matter through established bridge
**Requirements**:
- Active bridge (strength ≥0.5)
- Payload parameters set (volume, mass)
- Sufficient transfer energy available
- No safety violations during transfer

**Safety Interlocks**:
- **Bridge Monitoring**: Continuous strength verification during transfer
- **Energy Monitoring**: Ensures sufficient energy throughout process
- **Automatic Abort**: Stops transfer if bridge strength drops <0.4
- **Emergency Stop**: Immediate halt on any safety violation

**Transfer Process**:
1. **Pre-transfer Check**: Verify all requirements
2. **Energy Allocation**: Reserve energy for transfer operation
3. **Matter Dematerialization**: Convert matter to energy at Portal 1
4. **Energy Transfer**: Transmit through bridge to Portal 2
5. **Rematerialization**: Reconstruct matter at Portal 2
6. **Verification**: Confirm successful transfer completion

### Update Energy Button

#### **Function**: Applies new energy settings to both portals
**Default Operation**: Sets both portals to 1,000 J
**Safety Features**:
- **Gradual Ramp**: Energy changes at 500 J/second maximum
- **Stability Monitoring**: Pauses ramp if stability drops
- **Automatic Limits**: Prevents settings above 18,000 J
- **Emergency Stop**: Immediate halt on safety violations

**Energy Ramp Process**:
1. **Current State Assessment**: Check existing energy levels
2. **Ramp Calculation**: Determine optimal ramp rate
3. **Gradual Adjustment**: Increase/decrease energy smoothly
4. **Stability Monitoring**: Continuous stability verification
5. **Target Achievement**: Confirm final energy levels reached

## EVENT LOG SYSTEM

### Real-Time Event Monitoring

#### **Event Categories**:
**System Events**: Initialization, shutdown, configuration changes
**Operational Events**: Bridge formation, transfers, parameter updates
**Safety Events**: Violations, warnings, emergency stops
**Error Events**: System failures, communication errors

#### **Event Log Display**
**Format**: Timestamp + Event Type + Description
**Capacity**: Last 100 events stored, last 5 displayed
**Color Coding**:
- **Blue**: Successful operations
- **Green**: System status updates
- **Yellow**: Warnings and advisories
- **Red**: Errors and safety violations

**Sample Event Entries**:
```
[14:23:15] SUCCESS: Bridge formed, strength 0.847
[14:23:10] INFO: Portal frequencies synchronized
[14:23:05] WARNING: Portal 1 temperature elevated (32.5°C)
[14:22:58] ERROR: Bridge formation failed - frequency mismatch
[14:22:45] SUCCESS: Simulation initialized, run_id: run_607346
```

### Event Filtering and Search

#### **Filter Options**:
- **By Type**: System, Operational, Safety, Error
- **By Time**: Last hour, last day, all events
- **By Portal**: Portal 1 events, Portal 2 events, bridge events
- **By Severity**: Info, Warning, Error, Critical

#### **Export Functions**:
- **CSV Export**: Structured data for analysis
- **JSON Export**: Machine-readable format
- **Text Export**: Human-readable log format
- **Real-time Stream**: Live event monitoring

## BRIDGE VISUALIZATION SYSTEM

### Bridge Status Visualization

#### **Visual Bridge Representation**
**Active State**: Animated swirl (🌀) with energy flow effects
**Inactive State**: Static circle (⭕) indicating no connection
**Strength Indicator**: Progress bar showing bridge stability percentage
**Color Coding**: Green (strong), Yellow (moderate), Red (weak)

#### **Bridge Strength Progress Bar**
**Visual Elements**:
- **Background**: Gray bar showing full scale (0-100%)
- **Fill**: Colored bar indicating current strength
- **Animation**: Smooth transitions during strength changes
- **Percentage Text**: Numeric display of exact strength value

**Strength Categories**:
- **0-30%**: Red fill, "CRITICAL" status
- **30-50%**: Yellow fill, "UNSTABLE" status  
- **50-80%**: Green fill, "STABLE" status
- **80-100%**: Bright green fill, "OPTIMAL" status

### Real-Time Bridge Monitoring

#### **Continuous Assessment**
**Update Rate**: 10 Hz for real-time monitoring
**Parameters Monitored**:
- Frequency synchronization drift
- Energy balance changes
- Portal stability fluctuations
- Environmental condition changes

#### **Predictive Analysis**
**Trend Detection**: Identifies bridge strength trends
**Early Warning**: Alerts before bridge becomes unstable
**Optimization Suggestions**: Recommends parameter adjustments
**Failure Prediction**: Estimates time to bridge collapse

This comprehensive guide covers all aspects of the Central Command Screen operation, providing operators with complete control over bridge formation and transfer operations.
