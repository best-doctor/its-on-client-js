import { ItsOnClient } from './client';

describe('ItsOnClient', () => {
  const config = { url: 'http://localhost:3000', debugFlags: { flag1: true }, prefetchedFlags: { flag2: false } };
  let client: ItsOnClient;
  global.fetch = jest.fn();

  beforeEach(() => {
    client = new ItsOnClient(config);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should set debug flags', () => {
    client.setDebugFlag('flag1', true);
    expect(client.debugFlags).toEqual({ flag1: true });

    client.setDebugFlag('flag2', false);
    expect(client.debugFlags).toEqual({ flag1: true, flag2: false });
  });

  it('should set server flags', () => {
    client.setServerFlags({ flag2: true });
    expect(client.serverFlags).toEqual({ flag2: true });

    client.setServerFlags({ flag1: true, flag2: false });
    expect(client.serverFlags).toEqual({ flag1: true, flag2: false });
  });

  it('should drop debug flags', () => {
    client.dropDebugFlags();
    expect(client.debugFlags).toEqual({});
  });

  it('should fetch flags from server', async () => {
    const mockFlags = [{ flag1: true }, { flag2: false }];
    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockResolvedValueOnce({
      json: () => Promise.resolve({ result: mockFlags }),
    } as Response);

    const itsOnClient = new ItsOnClient({ url: 'https://example.com' });
    await itsOnClient.fetchFlags();

    expect(fetchSpy).toHaveBeenCalledWith('https://example.com');
  });

  it('should return empty object when failed to fetch flags', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => Promise.reject());

    const flags = await client.fetchFlags();

    expect(fetch).toHaveBeenCalledWith(config.url);
    expect(flags).toEqual({});
    expect(client.serverFlags).toEqual({flag2: false});
  });

  it('should get flag value', () => {
    expect(client.getFlagValue('flag1')).toBe(true);
    expect(client.getFlagValue('flag2')).toBe(false);
    expect(client.getFlagValue('unknown_flag')).toBe(false);
  });

  it('should check if flag is active', () => {
    expect(client.isActive('flag1')).toBe(true);
    expect(client.isActive('flag2')).toBe(false);
    expect(client.isActive('unknown_flag')).toBe(false);
  });

  it('should check if flag is not active', () => {
    expect(client.isNotActive('flag1')).toBe(false);
    expect(client.isNotActive('flag2')).toBe(true);
    expect(client.isNotActive('unknown_flag')).toBe(true);
  });

  it('should log flag', () => {
    jest.spyOn(console, 'log');

    client.logFlag('flag1');
    expect(console.log).toHaveBeenCalledWith('[Its On]', 'flag1: on');

    client.logFlag('flag2');
    expect(console.log).toHaveBeenCalledWith('[Its On]', 'flag2: off');
  });

  it('should log all flags', () => {
    jest.spyOn(console, 'log');

    client.logAllFlags();
    expect(console.log).toHaveBeenCalledWith('[Its On]', 'Flags: {\n\t"flag2": false,\n\t"flag1": true\n}');
  });

  it('should log debug flags', () => {
    jest.spyOn(console, 'log');

    client.logDebugFlags();
    expect(console.log).toHaveBeenCalledWith('[Its On]', 'Debug flags: {\n\t"flag2": false\n}');
  });
})
