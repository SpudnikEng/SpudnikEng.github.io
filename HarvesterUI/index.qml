import QtQuick 2.12
import QtQuick.Controls 2.12
import QtQuick.Layouts 1.12
import QtQuick.Window 2.12

ApplicationWindow {
    id: window
    width: 1280
    height: 800
    visible: true
    title: "Harvester UI Mockup"
    color: "#121212"

    // Color scheme matching CSS
    readonly property color contentBg: "#444444"
    readonly property color shellBg: "#2a2a2a"
    readonly property color tabBg: "#1a1a1a"  // Updated to match CSS
    readonly property color ink: "#f2f2f2"
    readonly property color muted: "#d0d0d0"
    readonly property color border: "#1a1a1a"
    readonly property color activeGreen: "#4D9920"
    readonly property color priButton: "#666666"
    readonly property color priButtonEm: "#CCCCCC"

    // State variables
    property bool runModeActive: false
    property bool groundModeActive: false
    property bool fixedModeActive: true
    property bool priShakerAuto: true
    property bool secShakerAuto: true
    property int currentImageIndex: 0
    readonly property int tabListWidth: 130
    
    // Chain setpoint values
    property var chainSetpoints: ({
        chainIntSPGround: 110, chainIntSPFixed: 220,
        chainPriSPGround: 115, chainPriSPFixed: 225,
        chainVineSPGround: 125, chainVineSPFixed: 235,
        chainRearCrossSPGround: 135, chainRearCrossSPFixed: 245,
        chainSideElevSPGround: 140, chainSideElevSPFixed: 250,
        chainPilerSPGround: 145, chainPilerSPFixed: 255,
        chainSegmentSP: 240,
        chainClodSP: 240,
        chainTransferSP: 230
    })
    
    property var chainButtonStates: ({
        intakeFwd: false, primaryFwd: false, vineFwd: false,
        clodFwd: false, segmentFwd: false, spreaderFwd: false,
        rearcrossFwd: false, sideelevatorFwd: false, pilerFwd: false,
        hopperFwd: false
    })
    
    property int primaryShaker: 45
    property int secondaryShaker: 45

    // Header/Master section
    Rectangle {
        id: masterHeader
        width: parent.width
        height: 80
        color: "#322F35"
        border.color: "#000000"
        border.width: 2

        Row {
            anchors.left: parent.left
            anchors.leftMargin: 7
            anchors.verticalCenter: parent.verticalCenter
            spacing: 7

            Image {
                id: logoSpudnik
                width: 220
                height: sourceSize.height * (width / sourceSize.width)
                source: "qrc:/icons/SpudnikLogo.svg"
                fillMode: Image.PreserveAspectFit
            }

            Column {
                anchors.verticalCenter: parent.verticalCenter
                spacing: 2

                Text {
                    id: headerSn
                    text: "7040-55-27"
                    font.pixelSize: 24
                    font.bold: true
                    color: "#FFFFFF"
                }

                Text {
                    id: headerVersion
                    text: "Version 2.08 / 1.03"
                    font.pixelSize: 12
                    font.bold: false
                    color: "#FFFFFF"
                }
            }
        }

        Row {
            anchors.right: parent.right
            anchors.rightMargin: 20
            anchors.verticalCenter: parent.verticalCenter
            spacing: 6

            Button {
                id: startButton
                width: 100
                height: 70
                font.pixelSize: 18
                font.weight: Font.Medium
                background: Rectangle {
                    id: startButtonBg
                    color: priButton
                    radius: 16
                }
                contentItem: Row {
                    spacing: 5
                    Image {
                        source: "qrc:/icons/play_arrow_24_FFFFFF.png"
                        width: 30
                        height: 30
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Text {
                        text: "Start"
                        color: "#FFFFFF"
                        font: startButton.font
                        anchors.verticalCenter: parent.verticalCenter
                    }
                }
                onClicked: {
                    startButtonBg.color = "#72BB53"
                    startButtonTimer.start()
                }
                Timer {
                    id: startButtonTimer
                    interval: 3000
                    onTriggered: {
                        startButtonBg.color = priButton
                    }
                }
            }

            Button {
                id: endButton
                width: 100
                height: 70
                font.pixelSize: 18
                font.weight: Font.Medium
                background: Rectangle {
                    id: endButtonBg
                    color: priButton
                    radius: 16
                }
                contentItem: Row {
                    spacing: 5
                    Image {
                        source: "qrc:/icons/stop_24_FFFFFF.png"
                        width: 30
                        height: 30
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Text {
                        text: "End"
                        color: "#FFFFFF"
                        font: endButton.font
                        anchors.verticalCenter: parent.verticalCenter
                    }
                }
                onClicked: {
                    endButtonBg.color = "#72BB53"
                    endButtonTimer.start()
                }
                Timer {
                    id: endButtonTimer
                    interval: 3000
                    onTriggered: {
                        endButtonBg.color = priButton
                    }
                }
            }

            Button {
                id: runButton
                width: 155
                height: 70
                font.pixelSize: 35
                font.bold: true
                background: Rectangle {
                    id: runButtonBg
                    color: priButtonEm
                    radius: 16
                }
                contentItem: Image {
                    source: "qrc:/icons/RUN_Sm.png"
                    anchors.centerIn: parent
                    anchors.verticalCenterOffset: 4
                }
                onClicked: toggleRun()
            }
        }
    }

    // Main content area
    Rectangle {
        id: frame
        anchors.top: masterHeader.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        width: parent.width
        height: parent.height - masterHeader.height
        color: shellBg
        border.color: border
        border.width: 1
        radius: 14

        Row {
            anchors.fill: parent
            spacing: 0

            // Content panels area
            Rectangle {
                id: panelsArea
                width: parent.width - tabListWidth
                height: parent.height
                color: window.contentBg

                StackLayout {
                    id: panelStack
                    anchors.fill: parent
                    anchors.margins: 0
                    anchors.leftMargin: 32
                    anchors.topMargin: 28
                    anchors.rightMargin: 32
                    anchors.bottomMargin: 28
                    currentIndex: tabBar.currentIndex

                    // Home/Controls Panel
                    Item {
                        id: panelControls
                        ScrollView {
                            anchors.fill: parent
                            clip: true

                            Item {
                                width: panelControls.width
                                height: Math.max(panelControls.height, imageContainer.height + 120)

                                // Image with overlay buttons
                                Item {
                                    id: imageContainer
                                    width: 1086
                                    height: image.height + 120
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    anchors.top: parent.top
                                    anchors.topMargin: 60

                                    Image {
                                        id: harvesterImage
                                        anchors.top: parent.top
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        width: 1086
                                        height: sourceSize.height * (width / sourceSize.width)
                                        source: "qrc:/icons/6844OffsetSideViewTransparentBackgroundSm.png"
                                        fillMode: Image.PreserveAspectFit
                                    }

                                    // Top overlay buttons - evenly spaced
                                    Loader {
                                        id: fanButton
                                        anchors.top: parent.top
                                        anchors.topMargin: 20
                                        anchors.horizontalCenter: undefined
                                        anchors.left: parent.left
                                        anchors.leftMargin: parent.width * 0.125 - 65
                                        sourceComponent: overlayButtonComponent
                                        onLoaded: {
                                            item.label = "Fan"
                                            item.info = "1250 rpm"
                                        }
                                    }

                                    Loader {
                                        id: multiSepButton
                                        anchors.top: parent.top
                                        anchors.topMargin: 20
                                        anchors.left: parent.left
                                        anchors.leftMargin: parent.width * 0.375 - 65
                                        sourceComponent: overlayButtonComponent
                                        onLoaded: {
                                            item.label = "MultiSep"
                                            item.info = "Clean Mode"
                                        }
                                    }

                                    Loader {
                                        id: shakersButton
                                        anchors.top: parent.top
                                        anchors.topMargin: 20
                                        anchors.left: parent.left
                                        anchors.leftMargin: parent.width * 0.625 - 65
                                        sourceComponent: overlayButtonComponent
                                        onLoaded: {
                                            item.label = "Shakers"
                                            item.info = "25%"
                                        }
                                    }

                                    Loader {
                                        id: boomHopperButton
                                        anchors.top: parent.top
                                        anchors.topMargin: 20
                                        anchors.left: parent.left
                                        anchors.leftMargin: parent.width * 0.875 - 65
                                        sourceComponent: overlayButtonComponent
                                        onLoaded: {
                                            item.label = "Boom/Hopper"
                                            item.info = "25% | 233 fpm"
                                        }
                                    }

                                    // Bottom overlay buttons - evenly spaced
                                    Loader {
                                        id: humpButton
                                        anchors.bottom: parent.bottom
                                        anchors.bottomMargin: 20
                                        anchors.left: parent.left
                                        anchors.leftMargin: parent.width * 0.125 - 65
                                        sourceComponent: overlayButtonComponent
                                        onLoaded: {
                                            item.label = "Hump"
                                            item.info = "20%"
                                        }
                                    }

                                    Loader {
                                        id: depthWheelsButton
                                        anchors.bottom: parent.bottom
                                        anchors.bottomMargin: 20
                                        anchors.left: parent.left
                                        anchors.leftMargin: parent.width * 0.375 - 65
                                        sourceComponent: overlayButtonComponent
                                        onLoaded: {
                                            item.label = "Depth Wheels"
                                            item.info = "60%"
                                        }
                                    }

                                    Loader {
                                        id: diggerBladeButton
                                        anchors.bottom: parent.bottom
                                        anchors.bottomMargin: 20
                                        anchors.left: parent.left
                                        anchors.leftMargin: parent.width * 0.625 - 65
                                        sourceComponent: overlayButtonComponent
                                        onLoaded: {
                                            item.label = "Digger Blade"
                                            item.info = "30%"
                                        }
                                    }

                                    Loader {
                                        id: coultersButton
                                        anchors.bottom: parent.bottom
                                        anchors.bottomMargin: 20
                                        anchors.left: parent.left
                                        anchors.leftMargin: parent.width * 0.875 - 65
                                        sourceComponent: overlayButtonComponent
                                        onLoaded: {
                                            item.label = "Coulters"
                                            item.info = "UP"
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Chains Panel - will be implemented with full table
                    ScrollView {
                        id: panelChains
                        clip: true
                        contentWidth: chainsTable.width
                        contentHeight: chainsTable.height

                        Column {
                            id: chainsTable
                            width: panelChains.width - 40
                            spacing: 0

                            // Chains header row
                            Row {
                                width: parent.width
                                height: 50
                                Rectangle {
                                    width: parent.width
                                    height: parent.height
                                    color: window.contentBg
                                    border.color: Qt.rgba(0, 0, 0, 0.15)
                                    border.width: 1
                                    Text {
                                        anchors.centerIn: parent
                                        text: "Chains"
                                        font.pixelSize: 26
                                        font.weight: Font.DemiBold
                                        color: window.ink
                                    }
                                }
                            }

                            // Adjust all row
                            Row {
                                width: parent.width
                                height: 60
                                Rectangle {
                                    width: 200
                                    height: parent.height
                                    color: window.contentBg
                                    border.color: Qt.rgba(0, 0, 0, 0.15)
                                    border.width: 1
                                    Text {
                                        anchors.left: parent.left
                                        anchors.leftMargin: 10
                                        anchors.verticalCenter: parent.verticalCenter
                                        text: "Adjust all:"
                                        font.pixelSize: 18
                                        font.weight: Font.Medium
                                        color: window.ink
                                    }
                                }
                                Rectangle {
                                    width: 300
                                    height: parent.height
                                    color: window.contentBg
                                    border.color: Qt.rgba(0, 0, 0, 0.15)
                                    border.width: 1
                                    Row {
                                        anchors.centerIn: parent
                                        spacing: 10
                                        Button {
                                            width: 50
                                            height: 45
                                            background: Rectangle {
                                                color: "#808080"
                                                radius: 14
                                            }
                                            contentItem: Text {
                                                text: "-10"
                                                color: "#FFFFFF"
                                                font.pixelSize: 16
                                                anchors.centerIn: parent
                                            }
                                            onClicked: bumpChainSetpointAll('dn')
                                        }
                                        Text {
                                            anchors.verticalCenter: parent.verticalCenter
                                            text: "CHAIN\nSPEEDS"
                                            font.pixelSize: 14
                                            color: window.ink
                                        }
                                        Button {
                                            width: 50
                                            height: 45
                                            background: Rectangle {
                                                color: "#808080"
                                                radius: 14
                                            }
                                            contentItem: Text {
                                                text: "+10"
                                                color: "#FFFFFF"
                                                font.pixelSize: 16
                                                anchors.centerIn: parent
                                            }
                                            onClicked: bumpChainSetpointAll('up')
                                        }
                                    }
                                }
                                Rectangle {
                                    width: parent.width - 500
                                    height: parent.height
                                    color: window.contentBg
                                    border.color: Qt.rgba(0, 0, 0, 0.15)
                                    border.width: 1
                                    Row {
                                        anchors.right: parent.right
                                        anchors.rightMargin: 10
                                        anchors.verticalCenter: parent.verticalCenter
                                        spacing: 0
                                        Button {
                                            width: 100
                                            height: 45
                                            text: "Ground Speed"
                                            background: Rectangle {
                                                color: window.groundModeActive ? window.activeGreen : "#808080"
                                                radius: 14
                                            }
                                            contentItem: Text {
                                                text: "Ground Speed"
                                                color: "#FFFFFF"
                                                font.pixelSize: 16
                                                anchors.centerIn: parent
                                            }
                                            onClicked: {
                                                window.groundModeActive = true
                                                window.fixedModeActive = false
                                            }
                                        }
                                        Button {
                                            width: 100
                                            height: 45
                                            background: Rectangle {
                                                color: window.fixedModeActive ? window.activeGreen : "#808080"
                                                radius: 14
                                            }
                                            contentItem: Text {
                                                text: "Fixed Speed"
                                                color: "#FFFFFF"
                                                font.pixelSize: 16
                                                anchors.centerIn: parent
                                            }
                                            onClicked: {
                                                window.fixedModeActive = true
                                                window.groundModeActive = false
                                            }
                                        }
                                    }
                                }
                            }

                            // Table header
                            Row {
                                width: parent.width
                                height: 50
                                Loader {
                                    width: 200
                                    height: 50
                                    sourceComponent: tableHeaderCellComponent
                                    onLoaded: item.text = "Name"
                                }
                                Loader {
                                    width: 200
                                    height: 50
                                    sourceComponent: tableHeaderCellComponent
                                    onLoaded: item.text = "Setpoint"
                                }
                                Loader {
                                    width: 120
                                    height: 50
                                    sourceComponent: tableHeaderCellComponent
                                    onLoaded: item.text = "Actual Speed"
                                }
                                Loader {
                                    width: 161
                                    height: 50
                                    visible: !window.runModeActive
                                    sourceComponent: tableHeaderCellComponent
                                    onLoaded: item.text = "Pressure"
                                }
                                Loader {
                                    width: 200
                                    height: 50
                                    visible: window.runModeActive
                                    sourceComponent: tableHeaderCellComponent
                                    onLoaded: item.text = "Manual Override"
                                }
                            }

                            // Chain rows - using component for each
                            Repeater {
                                model: [
                                    {name: "Intake:", setpointId: "chainIntSP", actualId: "chainIntActual", psiId: "chainIntPSI", forwardId: "intakeFwd"},
                                    {name: "Primary:", setpointId: "chainPriSP", actualId: "chainPriActual", psiId: "chainPriPSI", forwardId: "primaryFwd"},
                                    {name: "Secondary/Vine:", setpointId: "chainVineSP", actualId: "chainVineActual", psiId: "chainVinePSI", forwardId: "vineFwd"},
                                    {name: "Segment Rollers:", setpointId: "chainSegmentSP", actualId: "chainSegmentActual", psiId: "chainSegmentPSI", forwardId: "segmentFwd"},
                                    {name: "Clod Rollers:", setpointId: "chainClodSP", actualId: "chainClodActual", psiId: "chainClodPSI", forwardId: "clodFwd"},
                                    {name: "Transfer Rollers:", setpointId: "chainTransferSP", actualId: "chainTransferActual", psiId: "chainTransferPSI", forwardId: "spreaderFwd"},
                                    {name: "Rear Cross:", setpointId: "chainRearCrossSP", actualId: "chainRearCrossActual", psiId: "chainRearCrossPSI", forwardId: "rearcrossFwd"},
                                    {name: "Side Elev:", setpointId: "chainSideElevSP", actualId: "chainSideElevActual", psiId: "chainSideElevPSI", forwardId: "sideelevatorFwd"},
                                    {name: "Fill Elevator:", setpointId: "chainPilerSP", actualId: "chainPilerActual", psiId: "chainPilerPSI", forwardId: "pilerFwd"}
                                ]
                                Loader {
                                    width: parent.width
                                    sourceComponent: chainRowComponent
                                    onLoaded: {
                                        item.name = modelData.name
                                        item.setpointId = modelData.setpointId
                                        item.actualId = modelData.actualId
                                        item.psiId = modelData.psiId
                                        item.forwardId = modelData.forwardId
                                    }
                                }
                            }

                            // Hopper Chain row (special)
                            Row {
                                width: parent.width
                                height: 60
                                Rectangle {
                                    width: 200
                                    height: parent.height
                                    color: window.contentBg
                                    border.color: Qt.rgba(0, 0, 0, 0.15)
                                    border.width: 1
                                    Text {
                                        anchors.left: parent.left
                                        anchors.leftMargin: 10
                                        anchors.verticalCenter: parent.verticalCenter
                                        text: "Hopper Chain:"
                                        font.pixelSize: 18
                                        font.weight: Font.Medium
                                        color: window.ink
                                    }
                                }
                                Rectangle {
                                    width: 200
                                    height: parent.height
                                    color: window.contentBg
                                    border.color: Qt.rgba(0, 0, 0, 0.15)
                                    border.width: 1
                                    Row {
                                        anchors.centerIn: parent
                                        spacing: 0
                                        Button {
                                            width: 100
                                            height: 45
                                            text: "On"
                                            background: Rectangle {
                                                color: window.activeGreen
                                                radius: 14
                                            }
                                        }
                                        Button {
                                            width: 100
                                            height: 45
                                            text: "Off"
                                            background: Rectangle {
                                                color: "#808080"
                                                radius: 14
                                            }
                                        }
                                    }
                                }
                                Rectangle {
                                    width: 120
                                    height: parent.height
                                    color: window.contentBg
                                    border.color: Qt.rgba(0, 0, 0, 0.15)
                                    border.width: 1
                                    Text {
                                        anchors.right: parent.right
                                        anchors.rightMargin: 10
                                        anchors.verticalCenter: parent.verticalCenter
                                        text: "FPM"
                                        font.pixelSize: 18
                                        color: window.ink
                                    }
                                }
                                Rectangle {
                                    width: parent.width - 520
                                    height: parent.height
                                    color: window.contentBg
                                    border.color: Qt.rgba(0, 0, 0, 0.15)
                                    border.width: 1
                                    Row {
                                        anchors.right: parent.right
                                        anchors.rightMargin: 15
                                        anchors.verticalCenter: parent.verticalCenter
                                        spacing: 10
                                        Text {
                                            text: "Hopper:          FPM\nBoom:          FPM"
                                            font.pixelSize: 18
                                            color: window.ink
                                        }
                                        Button {
                                            width: 79
                                            height: 45
                                            text: "Fwd"
                                            background: Rectangle {
                                                color: window.chainButtonStates.hopperFwd ? window.activeGreen : "#808080"
                                                radius: 14
                                            }
                                            onClicked: window.chainButtonStates.hopperFwd = !window.chainButtonStates.hopperFwd
                                        }
                                    }
                                }
                            }

                            // Shakers section
                            Row {
                                width: parent.width
                                height: 150
                                spacing: 0
                                Rectangle {
                                    width: parent.width / 2
                                    height: parent.height
                                    color: window.contentBg
                                    border.color: Qt.rgba(0, 0, 0, 0.15)
                                    border.width: 1
                                    Column {
                                        anchors.centerIn: parent
                                        spacing: 10
                                        Text {
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            text: "Primary Shakers"
                                            font.pixelSize: 18
                                            font.weight: Font.Medium
                                            color: window.ink
                                        }
                                        Row {
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            spacing: 5
                                            Button {
                                                width: 70
                                                height: 45
                                                text: "-5"
                                                font.pixelSize: 25
                                                background: Rectangle {
                                                    color: "#808080"
                                                    radius: 14
                                                }
                                                onClicked: bumpInpSetpoint('primaryShaker', -5)
                                            }
                                            SpinBox {
                                                id: primaryShakerSpinBox
                                                from: 0
                                                to: 100
                                                value: window.primaryShaker
                                                width: 80
                                                height: 45
                                                onValueChanged: {
                                                    if (window.primaryShaker !== value) {
                                                        window.primaryShaker = value
                                                    }
                                                }
                                                Binding {
                                                    target: primaryShakerSpinBox
                                                    property: "value"
                                                    value: window.primaryShaker
                                                }
                                            }
                                            Button {
                                                width: 70
                                                height: 45
                                                text: "+5"
                                                font.pixelSize: 25
                                                background: Rectangle {
                                                    color: "#808080"
                                                    radius: 14
                                                }
                                                onClicked: bumpInpSetpoint('primaryShaker', 5)
                                            }
                                        }
                                        Row {
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            spacing: 0
                                            Button {
                                                width: 80
                                                height: 45
                                                text: "Auto"
                                                background: Rectangle {
                                                    color: window.priShakerAuto ? window.activeGreen : "#808080"
                                                    radius: 14
                                                }
                                                onClicked: window.priShakerAuto = !window.priShakerAuto
                                            }
                                            Button {
                                                width: 80
                                                height: 45
                                                text: "Manual"
                                                background: Rectangle {
                                                    color: window.priShakerAuto ? "#808080" : window.activeGreen
                                                    radius: 14
                                                }
                                                onClicked: window.priShakerAuto = false
                                            }
                                        }
                                    }
                                }
                                Rectangle {
                                    width: parent.width / 2
                                    height: parent.height
                                    color: window.contentBg
                                    border.color: Qt.rgba(0, 0, 0, 0.15)
                                    border.width: 1
                                    Column {
                                        anchors.centerIn: parent
                                        spacing: 10
                                        Text {
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            text: "Secondary Shakers"
                                            font.pixelSize: 18
                                            font.weight: Font.Medium
                                            color: window.ink
                                        }
                                        Row {
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            spacing: 5
                                            Button {
                                                width: 70
                                                height: 45
                                                text: "-5"
                                                font.pixelSize: 25
                                                background: Rectangle {
                                                    color: "#808080"
                                                    radius: 14
                                                }
                                                onClicked: bumpInpSetpoint('secondaryShaker', -5)
                                            }
                                            SpinBox {
                                                id: secondaryShakerSpinBox
                                                from: 0
                                                to: 100
                                                value: window.secondaryShaker
                                                width: 80
                                                height: 45
                                                onValueChanged: {
                                                    if (window.secondaryShaker !== value) {
                                                        window.secondaryShaker = value
                                                    }
                                                }
                                                Binding {
                                                    target: secondaryShakerSpinBox
                                                    property: "value"
                                                    value: window.secondaryShaker
                                                }
                                            }
                                            Button {
                                                width: 70
                                                height: 45
                                                text: "+5"
                                                font.pixelSize: 25
                                                background: Rectangle {
                                                    color: "#808080"
                                                    radius: 14
                                                }
                                                onClicked: bumpInpSetpoint('secondaryShaker', 5)
                                            }
                                        }
                                        Row {
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            spacing: 0
                                            Button {
                                                width: 80
                                                height: 45
                                                text: "Auto"
                                                background: Rectangle {
                                                    color: window.secShakerAuto ? window.activeGreen : "#808080"
                                                    radius: 14
                                                }
                                                onClicked: window.secShakerAuto = !window.secShakerAuto
                                            }
                                            Button {
                                                width: 80
                                                height: 45
                                                text: "Manual"
                                                background: Rectangle {
                                                    color: window.secShakerAuto ? "#808080" : window.activeGreen
                                                    radius: 14
                                                }
                                                onClicked: window.secShakerAuto = false
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Settings Panel
                    Item {
                        id: panelSettings
                        Column {
                            anchors.fill: parent
                            anchors.margins: 20
                            spacing: 20
                            Text {
                                text: "Settings"
                                font.pixelSize: 26
                                font.weight: Font.DemiBold
                                color: window.ink
                            }
                            Text {
                                text: "Welcome to <strong>Settings</strong>. Provide units, operator profiles, and calibration options here."
                                color: window.muted
                                width: parent.width
                                wrapMode: Text.WordWrap
                            }
                        }
                    }

                    // Diagnostics Panel
                    Item {
                        id: panelDiagnostics
                        Column {
                            anchors.fill: parent
                            anchors.margins: 20
                            spacing: 20
                            Text {
                                text: "Diagnostics"
                                font.pixelSize: 26
                                font.weight: Font.DemiBold
                                color: window.ink
                            }
                            Text {
                                text: "You're on <strong>Diagnostics</strong>. Display sensor health, error codes, and recent logs."
                                color: window.muted
                                width: parent.width
                                wrapMode: Text.WordWrap
                            }
                        }
                    }

                    // Help Panel
                    Item {
                        id: panelHelp
                        Column {
                            anchors.fill: parent
                            anchors.margins: 20
                            spacing: 20
                            Text {
                                text: "Help"
                                font.pixelSize: 26
                                font.weight: Font.DemiBold
                                color: window.ink
                            }
                            Text {
                                text: "This is the <strong>Help</strong> tab. Add quick tips, manuals, and troubleshooting steps."
                                color: window.muted
                                width: parent.width
                                wrapMode: Text.WordWrap
                            }
                        }
                    }
                }
            }

            // Tab list area
            Rectangle {
                id: tabListArea
                width: tabListWidth
                height: parent.height
                color: window.shellBg

                Column {
                    id: tabList
                    anchors.fill: parent
                    anchors.topMargin: 12
                    anchors.rightMargin: 12
                    anchors.bottomMargin: 12
                    anchors.leftMargin: 0
                    spacing: 20

                    TabButton {
                        id: tabControls
                        width: tabListWidth - 12
                        height: 100
                        checked: tabBar.currentIndex === 0
                        background: Rectangle {
                            color: tabBar.currentIndex === 0 ? window.contentBg : window.tabBg
                            border.color: window.border
                            border.width: 1
                            Rectangle {
                                anchors.left: parent.left
                                anchors.top: parent.top
                                anchors.bottom: parent.bottom
                                width: 1
                                color: parent.color
                            }
                            radius: 0
                        }
                        contentItem: Column {
                            spacing: 6
                            Image {
                                anchors.horizontalCenter: parent.horizontalCenter
                                source: "qrc:/icons/home_16dp_lt.png"
                                width: 28
                                height: 28
                            }
                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "Home"
                                font.pixelSize: 14
                                font.bold: true
                                color: tabBar.currentIndex === 0 ? window.ink : "#aaaaaa"
                            }
                        }
                        onClicked: tabBar.currentIndex = 0
                    }

                    TabButton {
                        id: tabChains
                        width: tabListWidth - 12
                        height: 100
                        checked: tabBar.currentIndex === 1
                        background: Rectangle {
                            color: tabBar.currentIndex === 1 ? window.contentBg : window.tabBg
                            border.color: window.border
                            border.width: 1
                            Rectangle {
                                anchors.left: parent.left
                                anchors.top: parent.top
                                anchors.bottom: parent.bottom
                                width: 1
                                color: parent.color
                            }
                            radius: 0
                        }
                        contentItem: Column {
                            spacing: 6
                            Image {
                                anchors.horizontalCenter: parent.horizontalCenter
                                source: "qrc:/icons/auto_16_lt.png"
                                width: 28
                                height: 28
                            }
                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "Chains"
                                font.pixelSize: 14
                                font.bold: true
                                color: tabBar.currentIndex === 1 ? window.ink : "#aaaaaa"
                            }
                        }
                        onClicked: tabBar.currentIndex = 1
                    }

                    TabButton {
                        id: tabSettings
                        width: tabListWidth - 12
                        height: 100
                        checked: tabBar.currentIndex === 2
                        background: Rectangle {
                            color: tabBar.currentIndex === 2 ? window.contentBg : window.tabBg
                            border.color: window.border
                            border.width: 1
                            Rectangle {
                                anchors.left: parent.left
                                anchors.top: parent.top
                                anchors.bottom: parent.bottom
                                width: 1
                                color: parent.color
                            }
                            radius: 0
                        }
                        contentItem: Column {
                            spacing: 6
                            Image {
                                anchors.horizontalCenter: parent.horizontalCenter
                                source: "qrc:/icons/settings_16_lt.png"
                                width: 28
                                height: 28
                            }
                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "Settings"
                                font.pixelSize: 14
                                font.bold: true
                                color: tabBar.currentIndex === 2 ? window.ink : "#aaaaaa"
                            }
                        }
                        onClicked: tabBar.currentIndex = 2
                    }

                    TabButton {
                        id: tabDiagnostics
                        width: tabListWidth - 12
                        height: 100
                        checked: tabBar.currentIndex === 3
                        background: Rectangle {
                            color: tabBar.currentIndex === 3 ? window.contentBg : window.tabBg
                            border.color: window.border
                            border.width: 1
                            Rectangle {
                                anchors.left: parent.left
                                anchors.top: parent.top
                                anchors.bottom: parent.bottom
                                width: 1
                                color: parent.color
                            }
                            radius: 0
                        }
                        contentItem: Column {
                            spacing: 6
                            Image {
                                anchors.horizontalCenter: parent.horizontalCenter
                                source: "qrc:/icons/troubleshoot_16_lt.png"
                                width: 28
                                height: 28
                            }
                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "Diagnostics"
                                font.pixelSize: 14
                                font.bold: true
                                color: tabBar.currentIndex === 3 ? window.ink : "#aaaaaa"
                            }
                        }
                        onClicked: tabBar.currentIndex = 3
                    }

                    TabButton {
                        id: tabHelp
                        width: tabListWidth - 12
                        height: 100
                        checked: tabBar.currentIndex === 4
                        background: Rectangle {
                            color: tabBar.currentIndex === 4 ? window.contentBg : window.tabBg
                            border.color: window.border
                            border.width: 1
                            Rectangle {
                                anchors.left: parent.left
                                anchors.top: parent.top
                                anchors.bottom: parent.bottom
                                width: 1
                                color: parent.color
                            }
                            radius: 0
                        }
                        contentItem: Column {
                            spacing: 6
                            Image {
                                anchors.horizontalCenter: parent.horizontalCenter
                                source: "qrc:/icons/help_16dp_lt.png"
                                width: 28
                                height: 28
                            }
                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "Help"
                                font.pixelSize: 14
                                font.bold: true
                                color: tabBar.currentIndex === 4 ? window.ink : "#aaaaaa"
                            }
                        }
                        onClicked: tabBar.currentIndex = 4
                    }
                }
            }
        }
    }

    // Invisible TabBar for state management
    TabBar {
        id: tabBar
        visible: false
        currentIndex: 0
    }

    // Modal dialog
    Rectangle {
        id: modal
        anchors.fill: parent
        color: "#80000000"
        visible: false
        z: 1000

        MouseArea {
            anchors.fill: parent
            onClicked: modal.visible = false
        }

        Rectangle {
            id: modalDialog
            width: 720
            height: 400
            anchors.centerIn: parent
            color: "#2e2e2e"
            radius: 12

            Column {
                anchors.fill: parent
                anchors.margins: 24
                spacing: 8

                Row {
                    width: parent.width
                    Text {
                        id: modalTitle
                        text: "Selection"
                        font.pixelSize: 20
                        font.bold: true
                        color: "#FFFFFF"
                    }
                    Item { width: parent.width - modalTitle.width - 100; height: 1 }
                    Button {
                        width: 80
                        height: 80
                        text: "×"
                        font.pixelSize: 56
                        font.bold: true
                        background: Rectangle {
                            color: "#555555"
                            radius: 8
                        }
                        contentItem: Text {
                            text: parent.parent.parent.text
                            color: "#FFFFFF"
                            font: parent.parent.parent.font
                            anchors.centerIn: parent
                        }
                        onClicked: modal.visible = false
                    }
                }

                Flickable {
                    width: parent.width
                    height: parent.height - 40
                    contentHeight: modalContent.height
                    clip: true
                    Text {
                        id: modalContent
                        width: parent.width
                        text: "This is placeholder text. Use this area for settings and troubleshooting steps for the selected function."
                        color: "#e5e5e5"
                        font.pixelSize: 15
                        wrapMode: Text.WordWrap
                    }
                }
            }
        }
    }

    // Functions matching JavaScript
    function toggleRun() {
        runModeActive = !runModeActive
        runButtonBg.color = runModeActive ? window.activeGreen : window.priButtonEm
        
        // Clear all forward buttons when RUN is activated
        if (runModeActive) {
            chainButtonStates.intakeFwd = false
            chainButtonStates.primaryFwd = false
            chainButtonStates.vineFwd = false
            chainButtonStates.clodFwd = false
            chainButtonStates.segmentFwd = false
            chainButtonStates.spreaderFwd = false
            chainButtonStates.rearcrossFwd = false
            chainButtonStates.sideelevatorFwd = false
            chainButtonStates.pilerFwd = false
        }
    }

    function bumpChainSetpoint(setPointId, direction) {
        var currentValue
        var setpointKey
        
        if (setPointId === "chainSegmentSP" || setPointId === "chainClodSP" || setPointId === "chainTransferSP") {
            // Roller setpoints (no ground/fixed mode)
            setpointKey = setPointId
            currentValue = chainSetpoints[setpointKey] || 10
        } else {
            // Chain setpoints (ground/fixed mode)
            if (groundModeActive) {
                setpointKey = setPointId + "Ground"
            } else {
                setpointKey = setPointId + "Fixed"
            }
            currentValue = chainSetpoints[setpointKey] || 10
        }
        
        if (currentValue < 10) currentValue = 10
        
        if (direction === "up") {
            chainSetpoints[setpointKey] = currentValue + 10
        } else {
            chainSetpoints[setpointKey] = Math.max(currentValue - 10, 10)
        }
    }

    function bumpChainSetpointAll(direction) {
        // Chains only; no change to clod/spreader/segment roller speeds
        bumpChainSetpoint("chainIntSP", direction)
        bumpChainSetpoint("chainPriSP", direction)
        bumpChainSetpoint("chainVineSP", direction)
        bumpChainSetpoint("chainRearCrossSP", direction)
        bumpChainSetpoint("chainSideElevSP", direction)
        bumpChainSetpoint("chainPilerSP", direction)
    }

    function bumpInpSetpoint(id, inc) {
        if (id === 'primaryShaker') {
            var newValue = primaryShaker + inc
            primaryShaker = Math.max(0, Math.min(100, newValue))
            primaryShakerSpinBox.value = primaryShaker
        } else if (id === 'secondaryShaker') {
            var newValue = secondaryShaker + inc
            secondaryShaker = Math.max(0, Math.min(100, newValue))
            secondaryShakerSpinBox.value = secondaryShaker
        }
    }

    function openModal(title, content) {
        modalTitle.text = title
        modalContent.text = content
        modal.visible = true
    }

    // Modal content mapping
    readonly property var modalContentMap: ({
        'Fan': 'The <strong>Fan</strong> controls airflow to aid cleaning.',
        'MultiSep': '<strong>MultiSep</strong> separates soil / clods.',
        'Shakers': '<strong>Shakers</strong> assist soil removal. Current: <em>25%</em>.\n• Increase on heavy soil.\n• Decrease to protect tubers.',
        'Boom/Hopper': '<strong>Boom/Hopper</strong> controls discharge and conveyor. Current: <em>25% | 233 fpm</em>.\n• Match truck speed to fpm.\n• Avoid overfilling the pile.',
        'Hump': '<strong>Hump</strong> lifts crop to clear debris. Current: <em>20%</em>.\n• Use sparingly to protect skins.',
        'Depth Wheels': '<strong>Depth Wheels</strong> set dig depth. Current: <em>60%</em>.\n• Keep blade just below stolons.',
        'Coulters': '<strong>Coulters</strong> control cutting depth.',
        'Digger Blade': '<strong>Digger Blade</strong> angle/height affects intake. Current: <em>30%</em>.\n• Raise slightly in rocky patches.'
    })

// Overlay Button Component
Component {
    id: overlayButtonComponent
    Button {
        property string label: ""
        property string info: ""
        width: 130
        height: 90
        background: Rectangle {
            color: "#f5f5f5"
            radius: 10
        }
        contentItem: Column {
            spacing: 4
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: label
                font.pixelSize: 16
                font.weight: Font.DemiBold
                color: "#000000"
            }
            Rectangle {
                anchors.horizontalCenter: parent.horizontalCenter
                width: parent.parent.width - 20
                height: 20
                color: Qt.rgba(0, 0, 0, 0.08)
                radius: 4
                Text {
                    anchors.centerIn: parent
                    text: info
                    font.pixelSize: 14
                    font.weight: Font.Normal
                    color: "#000000"
                }
            }
        }
        onClicked: {
            var content = window.modalContentMap[label] || ("This is placeholder text for <strong>" + label + "</strong>. Current setting: <em>" + info + "</em>.")
            window.openModal(label, content)
        }
    }
}

// Table Header Cell Component
Component {
    id: tableHeaderCellComponent
    Rectangle {
        property string text: ""
        border.color: Qt.rgba(0, 0, 0, 0.15)
        border.width: 1
        color: window.contentBg
        Text {
            anchors.centerIn: parent
            text: parent.text
            font.pixelSize: 18
            font.weight: Font.Medium
            color: window.ink
        }
    }
}

// Chain Row Component
Component {
    id: chainRowComponent
    Row {
        property string name: ""
        property string setpointId: ""
        property string actualId: ""
        property string psiId: ""
        property string forwardId: ""
        width: parent.width
        height: 60
        spacing: 0

        Rectangle {
            width: 200
            height: parent.height
            color: window.contentBg
            border.color: Qt.rgba(0, 0, 0, 0.15)
            border.width: 1
            Text {
                anchors.left: parent.left
                anchors.leftMargin: 10
                anchors.verticalCenter: parent.verticalCenter
                text: name
                font.pixelSize: 18
                font.weight: Font.Medium
                color: window.ink
            }
        }
        Rectangle {
            width: 200
            height: parent.height
            color: window.contentBg
            border.color: Qt.rgba(0, 0, 0, 0.15)
            border.width: 1
            Row {
                anchors.centerIn: parent
                spacing: 5
                Button {
                    width: 50
                    height: 45
                    background: Rectangle {
                        color: "#808080"
                        radius: 14
                    }
                    contentItem: Text {
                        text: "-10"
                        color: "#FFFFFF"
                        font.pixelSize: 16
                        anchors.centerIn: parent
                    }
                    onClicked: window.bumpChainSetpoint(setpointId, 'dn')
                }
                SpinBox {
                    id: setpointSpinBox
                    from: 0
                    to: 1000
                    width: 80
                    height: 45
                    property string currentKey: {
                        if (setpointId === "chainSegmentSP" || setpointId === "chainClodSP" || setpointId === "chainTransferSP") {
                            return setpointId
                        } else {
                            return window.groundModeActive ? (setpointId + "Ground") : (setpointId + "Fixed")
                        }
                    }
                    value: {
                        var key = currentKey
                        return window.chainSetpoints[key] || 0
                    }
                    onValueChanged: {
                        var key = currentKey
                        window.chainSetpoints[key] = value
                    }
                }
                Button {
                    width: 50
                    height: 45
                    background: Rectangle {
                        color: "#808080"
                        radius: 14
                    }
                    contentItem: Text {
                        text: "+10"
                        color: "#FFFFFF"
                        font.pixelSize: 16
                        anchors.centerIn: parent
                    }
                    onClicked: window.bumpChainSetpoint(setpointId, 'up')
                }
            }
        }
        Rectangle {
            width: 120
            height: parent.height
            color: window.contentBg
            border.color: Qt.rgba(0, 0, 0, 0.15)
            border.width: 1
            Text {
                anchors.right: parent.right
                anchors.rightMargin: 10
                anchors.verticalCenter: parent.verticalCenter
                text: "FPM"
                font.pixelSize: 18
                color: window.ink
            }
        }
        Rectangle {
            width: 161
            height: parent.height
            color: window.contentBg
            border.color: Qt.rgba(0, 0, 0, 0.15)
            border.width: 1
            visible: !window.runModeActive
            Text {
                anchors.right: parent.right
                anchors.rightMargin: 10
                anchors.verticalCenter: parent.verticalCenter
                text: "PSI"
                font.pixelSize: 18
                color: window.ink
            }
        }
        Rectangle {
            width: 200
            height: parent.height
            color: window.contentBg
            border.color: Qt.rgba(0, 0, 0, 0.15)
            border.width: 1
            visible: window.runModeActive
            Row {
                anchors.centerIn: parent
                spacing: 0
                Button {
                    width: 79
                    height: 45
                    text: "Rev"
                    background: Rectangle {
                        color: "#808080"
                        radius: 14
                    }
                    contentItem: Image {
                        source: "qrc:/icons/counterclockwise_16.png"
                        anchors.centerIn: parent
                    }
                    onClicked: {
                        window.chainButtonStates[forwardId] = false
                    }
                }
                Button {
                    width: 79
                    height: 45
                    text: "Fwd"
                    background: Rectangle {
                        color: window.chainButtonStates[forwardId] ? window.activeGreen : "#808080"
                        radius: 14
                    }
                    contentItem: Image {
                        source: "qrc:/icons/clockwise_16.png"
                        anchors.centerIn: parent
                    }
                    onClicked: {
                        window.chainButtonStates[forwardId] = !window.chainButtonStates[forwardId]
                    }
                }
            }
        }
    }
}
}
