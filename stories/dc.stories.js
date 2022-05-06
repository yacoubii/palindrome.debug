import { dcBasicConfiguration } from '../src/data_structures_examples/dc_BasicConfiguration';
import { dcCustomConfiguration } from '../src/data_structures_examples/dc_CustomConfiguration';
import { dcEnergeticEfficiency } from '../src/data_structures_examples/dc_EnergeticEfficiency';
import { dcMy3DObjectExample } from '../src/data_structures_examples/dc_My3DObjectExample';
import { dcFullMap } from '../src/data_structures_examples/dc_FullMap';
import { defaultControls } from './controls/defaultControls';
import { createPalindrome } from './controls/createPalindrome';

export default {
    title: 'Use Cases/Palindrome/Data Center example',
    argTypes: defaultControls(),
};

export const BasicConfiguration = createPalindrome.bind({});
BasicConfiguration.args = {
    layerMidColor: '#DFDF0B',
    mainAppColor: '#00FF06',
    subAppColor: '#9FC5E8',
    statusColorLow: '#9FC5E8',
    statusColorMed: '#00FF00',
    statusColorHigh: '#FF0000',
    statusColorVeryHigh: '#FF0000',
    data: dcBasicConfiguration(),
};

export const CustomConfiguration = createPalindrome.bind({});
CustomConfiguration.args = {
    layerMidColor: '#FF2C00',
    mainAppColor: '#FFCC00',
    subAppColor: '#FFFFFF',
    statusColorLow: '#9FC5E8',
    statusColorMed: '#00FF00',
    statusColorHigh: '#FF0000',
    statusColorVeryHigh: '#FF0000',
    data: dcCustomConfiguration(),
};

export const FullMap = createPalindrome.bind({});
FullMap.args = {
    layerMidColor: '#FF2C00',
    mainAppColor: '#FFDD00',
    subAppColor: '#FFFFFF',
    data: dcFullMap(),
};
/*    statusColorLow: '#1f83f9',
    statusColorMed: '#319b31',
    statusColorHigh: '#FF0000',
    statusColorVeryHigh: '#FF0000',*/

export const EnergeticEfficiency = createPalindrome.bind({});
EnergeticEfficiency.args = {
    layerMidColor: '#FF2C00',
    mainAppColor: '#FFDD00',
    subAppColor: '#FFFFFF',
    data: dcEnergeticEfficiency(),
};

export const My3DObjectExample = createPalindrome.bind({});
My3DObjectExample.args = {
    layerMidColor: '#DFDF0B',
    mainAppColor: '#00FF06',
    subAppColor: '#9FC5E8',
    statusColorLow: '#000000',
    statusColorMed: '#00FF00',
    statusColorHigh: '#FF0000',
    statusColorVeryHigh: '#FF0000',
    data: dcMy3DObjectExample(),
}; 
