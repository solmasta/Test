let uuidv4Promise;
const getUuidv4 = () => {
  if (!uuidv4Promise) {
    uuidv4Promise = import('uuid').then((mod) => mod.v4);
  }
  return uuidv4Promise;
};

const requestLogger = async (req, res, next) => {
  const uuidv4 = await getUuidv4();
  req.id = req.headers['x-request-id'] || uuidv4();
  req.startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    const timestamp = new Date().toISOString();

    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    const log = {
      level: logLevel,
      timestamp,
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user ? req.user._id : 'anonymous',
    };

    console.log(JSON.stringify(log));
  });

  next();
};

module.exports = requestLogger;
