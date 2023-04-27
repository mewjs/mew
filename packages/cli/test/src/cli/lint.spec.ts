import { getOptions } from '../../../src/cli';
import lint from '../../../src/cli/lint';

describe('lint', () => {
    jest.setTimeout(10000);

    it('lint baidu', done => {
        const options = getOptions(['https://www.baidu.com/']);

        options.silent = true;
        options.level = 'error';

        lint(options, (success, json) => {
            if (success) {
                expect(json.length).toBe(0);
            }
            else {
                expect(json.length > 0).toBe(true);
            }
            done();
        });
    });
});
