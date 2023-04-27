import childProcess from 'child_process';

import git from '../src/git';

describe('util', () => {

    it('git', () => {
        const spy = jest.spyOn(childProcess, 'spawn');
        const args = ['log', '--pretty=format:%H'];
        const finish = jest.fn();
        git(args, finish);
        expect(spy).toHaveBeenCalledWith('git', args, void 0);
        expect(finish).not.toHaveBeenCalled();
        spy.mockRestore();
    });

});
