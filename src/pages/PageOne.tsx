import React,{useEffect} from 'react';

import { getBackendSrv, config } from '@grafana/runtime';
import { lastValueFrom } from 'rxjs';
const user = config.bootData.user;


const sendEvent = async () => {
  const res = await lastValueFrom(getBackendSrv().fetch({
    url: `/api/plugins/grafana-event-tracking-plugin/resources/ping`,
    method: 'POST',
    data: {
      action: 'button_click',
      time: new Date(),
      user: user ? user.login : 'anonymous',
    },
  }));

  console.log(res);
};
function PageOne() {

  useEffect(() => {
    console.log("PageOne mounted");

    return () => {
      console.log("PageOne unmounted");
    };
  }, []);
  return (
    <div>
      <h1>Page One</h1>
      <button onClick={sendEvent}>Send Event</button>
    </div>
  );
}

export default PageOne;


