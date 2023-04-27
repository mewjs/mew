module.exports = {
    extends: [
        require.resolve('./react')
    ],
    plugins: ['react-native'],
    rules: {
        'react-native/no-color-literals': 1,
        'react-native/no-inline-styles': 1,
        'react-native/no-single-element-style-arrays': 1,
        'react-native/no-raw-text': 2,
        'react-native/no-unused-styles': 2,
        'react-native/split-platform-components': 2,
        'react-native/sort-styles': 0
    }
};
