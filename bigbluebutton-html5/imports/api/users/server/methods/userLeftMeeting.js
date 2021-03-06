import Logger from '/imports/startup/server/logger';
import Users from '/imports/api/users';
import { extractCredentials } from '/imports/api/common/server/helpers';
import ClientConnections from '/imports/startup/server/ClientConnections';

export default function userLeftMeeting() { // TODO-- spread the code to method/modifier/handler
  // so we don't update the db in a method
  const { meetingId, requesterUserId } = extractCredentials(this.userId);

  const selector = {
    meetingId,
    userId: requesterUserId,
  };

  const cb = (err, numChanged) => {
    if (err) {
      Logger.error(`leaving dummy user to collection: ${err}`);
      return;
    }
    if (numChanged) {
      Logger.info(`user left id=${requesterUserId} meeting=${meetingId}`);
    }
  };

  ClientConnections.removeClientConnection(this.userId, this.connection.id);

  return Users.update(
    selector,
    {
      $set: {
        loggedOut: true,
      },
    },
    cb,
  );
}
