import { readmeBasicConfiguration } from '../src/data_structures_examples/readme_BasicConfiguration';
import { defaultControls,defaultValues } from './controls/defaultControls';
import { createPalindrome } from './controls/createPalindrome';

export default {
    title: 'READ ME/Dali/readme example',
    argTypes: defaultControls(),
    args: defaultValues(),
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
    data: readmeBasicConfiguration(),
};