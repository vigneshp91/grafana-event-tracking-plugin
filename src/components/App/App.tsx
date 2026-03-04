import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
import { ROUTES } from '../../constants';
import { locationService, getBackendSrv } from '@grafana/runtime';
import { lastValueFrom } from 'rxjs';

const PageOne = React.lazy(() => import('../../pages/PageOne'));
const PageTwo = React.lazy(() => import('../../pages/PageTwo'));
const PageThree = React.lazy(() => import('../../pages/PageThree'));
const PageFour = React.lazy(() => import('../../pages/PageFour'));


function App(props: AppRootProps) {
  
  useEffect(() => {
    console.log("Tracking initialized");

    const unsubscribe = locationService.getHistory().listen((location: { pathname: string }) => {
      const path = location.pathname;

      console.log("Route changed:", path);

      // 🎯 Track dashboard visits
      if (path.startsWith('/d/')) {
        const dashboardUid = path.split('/')[2];

        const event = {
          event_type: 'dashboard_view',
          dashboard_uid: dashboardUid,
          path: path,
          timestamp: new Date().toISOString(),
        };

        console.log("Sending event:", event);

        lastValueFrom(
          getBackendSrv().fetch({
            url: '/api/plugins/grafana-event-tracking-plugin/resources/track-event',
            method: 'POST',
            data: event,
          })
        ).catch((err) => {
          console.error("Tracking failed:", err);
        });
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <Routes>
      <Route path={ROUTES.Two} element={<PageTwo />} />
      <Route path={`${ROUTES.Three}/:id?`} element={<PageThree />} />

      {/* Full-width page (this page will have no side navigation) */}
      <Route path={ROUTES.Four} element={<PageFour />} />

      {/* Default page */}
      <Route path="*" element={<PageOne />} />
    </Routes>
  );
}

export default App;


