import should from 'should';

// for example
describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      [1,2,3].indexOf(4).should.eql(-1);
    });
  });
});
