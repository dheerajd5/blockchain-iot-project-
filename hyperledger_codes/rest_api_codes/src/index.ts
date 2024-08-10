/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * This is the main entrypoint for the sample REST server, which is responsible
 * for connecting to the Fabric network and setting up a job queue for
 * processing submit transactions
 */

import * as config from './config';
import {
  createGateway,
  createWallet,
  getContracts,
  getNetwork,
} from './fabric';
import {
  initJobQueue,
  initJobQueueScheduler,
  initJobQueueWorker,
} from './jobs';
import { logger } from './logger';
import { createServer } from './server';
import { isMaxmemoryPolicyNoeviction } from './redis';
import { Queue, QueueScheduler, Worker } from 'bullmq';

let jobQueue: Queue | undefined;
let jobQueueWorker: Worker | undefined;
let jobQueueScheduler: QueueScheduler | undefined;

async function main() {
  logger.info('Checking Redis config');
  if (!(await isMaxmemoryPolicyNoeviction())) {
    throw new Error(
      'Invalid redis configuration: redis instance must have the setting maxmemory-policy=noeviction'
    );
  }

  logger.info('Creating REST server');
  const app = await createServer();

  logger.info('Connecting to Fabric network with org1 mspid');
  const wallet = await createWallet();

  const gatewayOrg1 = await createGateway(
    config.connectionProfileOrg1,
    config.mspIdOrg1,
    wallet
  );
  const networkOrg1 = await getNetwork(gatewayOrg1);
  const chaincodeOrg1 = 'easwar';
  const contractsOrg1 = await getContracts(networkOrg1, chaincodeOrg1);

  app.locals[config.mspIdOrg1] = contractsOrg1;

  logger.info('Connecting to Fabric network with org2 mspid');
  const gatewayOrg2 = await createGateway(
    config.connectionProfileOrg2,
    config.mspIdOrg2,
    wallet
  );
  const networkOrg2 = await getNetwork(gatewayOrg2);
  const chaincodeOrg2 = 'nitin';
  const contractsOrg2 = await getContracts(networkOrg2, chaincodeOrg2);

  app.locals[config.mspIdOrg2] = contractsOrg2;

  logger.info('Connecting to Fabric network with org3 mspid');
  const gatewayOrg3 = await createGateway(
    config.connectionProfileOrg3,
    config.mspIdOrg3,
    wallet
  );
  const networkOrg3 = await getNetwork(gatewayOrg3);
  const chaincodeOrg3 = 'rohit';
  const contractsOrg3 = await getContracts(networkOrg3, chaincodeOrg3);

  app.locals[config.mspIdOrg3] = contractsOrg3;

  logger.info('Connecting to Fabric network with org4 mspid');
  const gatewayOrg4 = await createGateway(
    config.connectionProfileOrg4,
    config.mspIdOrg4,
    wallet
  );
  const networkOrg4 = await getNetwork(gatewayOrg4);
  const chaincodeOrg4 = 'dheeraj';
  const contractsOrg4 = await getContracts(networkOrg4, chaincodeOrg4);

  app.locals[config.mspIdOrg4] = contractsOrg4;

  logger.info('Connecting to Fabric network with org5 mspid');
  const gatewayOrg5 = await createGateway(
    config.connectionProfileOrg5,
    config.mspIdOrg5,
    wallet
  );
  const networkOrg5 = await getNetwork(gatewayOrg5);
  const chaincodeOrg5 = 'farzan';
  const contractsOrg5 = await getContracts(networkOrg5, chaincodeOrg5);

  app.locals[config.mspIdOrg5] = contractsOrg5;

  logger.info('Initialising submit job queue');
  jobQueue = initJobQueue();
  jobQueueWorker = initJobQueueWorker(app);
  if (config.submitJobQueueScheduler === true) {
    logger.info('Initialising submit job queue scheduler');
    jobQueueScheduler = initJobQueueScheduler();
  }
  app.locals.jobq = jobQueue;

  logger.info('Starting REST server');
  app.listen(config.port, () => {
    logger.info('REST server started on port: %d', config.port);
  });
}

main().catch(async (err) => {
  logger.error({ err }, 'Unxepected error');

  if (jobQueueScheduler != undefined) {
    logger.debug('Closing job queue scheduler');
    await jobQueueScheduler.close();
  }

  if (jobQueueWorker != undefined) {
    logger.debug('Closing job queue worker');
    await jobQueueWorker.close();
  }

  if (jobQueue != undefined) {
    logger.debug('Closing job queue');
    await jobQueue.close();
  }
});
