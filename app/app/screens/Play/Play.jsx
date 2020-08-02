import React, { Component, useEffect } from 'react';
import { View, StyleSheet, Button, Text, Dimensions, PanResponder, Animated } from 'react-native';
import RNVideo from 'react-native-video';
import SlidingPanel from 'rn-sliding-up-panel';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import RNFS from 'react-native-fs';
import Controls from './Controls';
import TopControls from './TopControls';
import MapView from './MapView';
import { formatElapsed } from '../../utils/formatting';

const { height, width } = Dimensions.get('window');
const CONTROLS_HEIGHT = 140; // Includes the sliding bar
const DRAWER_DEFAULT_TOP = 0.4 * height + CONTROLS_HEIGHT; // Middle snapping
const SLIDE_TRIGGER_HEIGHT = 12; // Invisible padding to drag
const DRAWER_DEFAULT_BOTTOM = 16 + SLIDE_TRIGGER_HEIGHT; // Some space for it to be draggable

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff00',
    },
    playerContainer: {
        overflow: 'hidden',
        backgroundColor: '#000',
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
    },
    playerVideo: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    videoContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        paddingTop: 12,
    },
    controlsContainer: {
        height: CONTROLS_HEIGHT,
        display: 'flex',
        flexDirection: 'row',
    },
    mapContainer: {
        flexGrow: 1,
        backgroundColor: '#777',
        borderRadius: 12,
        marginTop: 12,
    },
    slidingPanelTop: {
        height: SLIDE_TRIGGER_HEIGHT,
        backgroundColor: '#ffffff00',
    },
    slidingPanel: {
        flex: 1,
        backgroundColor: '#1f1f1f',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    dragBox: {
        alignSelf: 'flex-start',
        alignContent: 'center',
        backgroundColor: '#fff',
        width: width * 0.15,
        height: 4,
        borderRadius: 4,
        marginVertical: 6,
    },
    topOptions: {
        height: 150,
        width: width,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    divider: {
        marginHorizontal: 60,
        height: 1,
        backgroundColor: '#6c6c6c',
    },
});

function Seeker({ seeking = false, start = 0, end = 0, value = 0, onSeek, onSeekStart, onSeekEnd }) {
    const [step, setStep] = React.useState(0);
    useEffect(() => {
        setStep((end - start) / 100);
    }, [start, end]);
    return (
        <Slider
            minimumValue={start}
            maximumValue={end}
            value={value}
            onValueChange={onSeek}
            onSlidingStart={onSeekStart}
            onSlidingComplete={onSeekEnd}
            step={step}
            style={styles.seekSlider}
        />
    );
}

class Play extends Component {
    slidePanel = null;
    _draggedPanelValue = new Animated.Value(CONTROLS_HEIGHT + SLIDE_TRIGGER_HEIGHT);
    videoHeight = Animated.subtract(height - 16, this._draggedPanelValue);
    player = null;

    constructor(props) {
        super(props);
        this.state = {
            paused: false,
            repeat: true,
            muted: false,
            volume: 1,
            rate: 1,
            videoHeight: height,
            loadControls: false,
            seeking: false,
            currentTime: 0,
            seekTime: 0,
            duration: 0,
            locations: [],
        };
        this.videoUrl = "file://" + this.props.route.params.videoPath;
        this.jsonPath = this.props.route.params.jsonPath;
        this.options = {
            playWhenInactive: false,
            playInBackground: false,
        };
    }

    onExport = () => { };
    onShare = () => { };
    onOpenInfo = () => { };
    onDelete = () => { };
    onToggleDarkMode = () => { };
    onSeekPlus = () => { };
    onSeekMinus = () => { };
    onPlayPause = () => {
        this.setState({ paused: !this.state.paused });
    };
    onLockControls = () => { };
    onToggleOptions = () => { };
    onLoadStart = () => {
        if (!this.state.loading)
            this.setState({
                loading: true,
            });
    };
    onLoad = (data = {}) => {
        this.setState({
            loadControls: true,
            loading: false,
            duration: data.duration,
        });
    };
    onProgress = (data = {}) => {
        this.setState({
            currentTime: data.currentTime,
        });
    };
    onSeekStart = () => {
        this.setState({ seeking: true, paused: true });
    };
    onSeekEnd = (v) => {
        this.player.seek(v, 250);
    };
    seekTo = (v) => { };
    onSeekComplete = (data = {}) => {
        this.setState({ paused: false, currentTime: data.currentTime }, () => {
            this.setState({ seeking: false });
        });
    };
    onCurrentLocationChange = (time) => {
        this.player.seek(time);
    }
    render() {
        const top = DRAWER_DEFAULT_TOP;
        const bottom = DRAWER_DEFAULT_BOTTOM;
        const elapsedTime = formatElapsed(this.state.currentTime);
        const remainingTime = formatElapsed(this.state.duration - this.state.currentTime);

        const currentTime = this.state.currentTime * 1000;
        let currentLocation = null;
        let speed = 0;
        this.state.locations.forEach(l => {
            if (currentLocation === null && l.elapsed >= currentTime) {
                currentLocation = l;
                speed = l.speed;
            }
        })

        return (
            <View style={styles.container}>
                <Animated.View style={[styles.videoContainer, { height: this.videoHeight }]}>
                    <View style={styles.playerContainer}>
                        <RNVideo
                            ref={(ref) => (this.player = ref)}
                            {...this.options}
                            style={styles.playerVideo}
                            volume={this.state.volume}
                            paused={this.state.paused}
                            rate={this.state.rate}
                            resizeMode={'contain'}
                            source={{
                                uri: this.videoUrl,
                            }}
                            resizeMode={'contain'}
                            repeat={this.state.repeat}
                            onLoadStart={this.onLoadStart}
                            onLoad={this.onLoad}
                            onProgress={this.onProgress}
                            minLoadRetryCount={5}
                            onSeek={this.onSeekComplete}
                        />
                    </View>
                    <TopControls
                        onExport={this.onExport}
                        onShare={this.onShare}
                        onOpenInfo={this.onOpenInfo}
                        onDelete={this.onDelete}
                        onToggleDarkMode={this.onToggleDarkMode}
                        speed={`${speed.toFixed(0)} km/h`}
                    />
                </Animated.View>
                <SlidingPanel
                    containerStyle={{ backgroundColor: '#000' }}
                    backdropStyle={{ backgroundColor: 'transparent' }}
                    ref={(c) => (this.slidePanel = c)}
                    draggableRange={{ top, bottom }}
                    snappingPoints={[DRAWER_DEFAULT_BOTTOM, CONTROLS_HEIGHT]}
                    animatedValue={this._draggedPanelValue}
                    height={height + CONTROLS_HEIGHT + SLIDE_TRIGGER_HEIGHT}
                    friction={0.75}
                    showBackdrop={false}
                    onMomentumDragEnd={this.adjustVideoHeight}>
                    <React.Fragment>
                        <View style={styles.slidingPanelTop} />
                        <Animated.View style={styles.slidingPanel}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={styles.dragBox} />
                            </View>
                            {/* TODO: External Controls */}
                            {this.state.loadControls && (
                                <Controls
                                    player={this.player}
                                    style={styles.controlsContainer}
                                    paused={this.state.paused}
                                    onPlayPause={this.onPlayPause}
                                    onLockControls={this.onLockControls}
                                    onSeekMinus={this.onSeekMinus}
                                    onSeek={this.onSeek}
                                    onSeekPlus={this.onSeekPlus}
                                    elapsed={elapsedTime}
                                    remaining={remainingTime}
                                    seekTo={this.seekTo}
                                    seekStart={this.onSeekStart}
                                    seekEnd={this.onSeekEnd}
                                    seeker={
                                        <Seeker
                                            start={0}
                                            end={this.state.duration}
                                            value={this.state.currentTime}
                                            onSeek={this.seekTo}
                                            onSeekEnd={this.onSeekEnd}
                                            onSeekStart={this.onSeekStart}
                                        />
                                    }
                                />
                            )}
                            <View style={styles.divider} />
                            <View style={styles.mapContainer}>
                                <MapView
                                    locations={this.state.locations}
                                    currentTime={this.state.currentTime}
                                    currentLocation={currentLocation}
                                    onCurrentLocationChange={this.onCurrentLocationChange} />
                            </View>
                        </Animated.View>
                    </React.Fragment>
                </SlidingPanel>
            </View>
        );
    }
    componentDidMount() {
        RNFS.readFile(this.jsonPath).then(data => {
            this.setState({ locations: JSON.parse(data) });
        })
    }
    // componentWillUnmount() {}
}

export default Play;
