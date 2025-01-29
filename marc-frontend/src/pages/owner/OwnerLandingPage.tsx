import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { fetchProjects } from "../../redux/actions/projectActions";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import "./OwnerLanding.scss";
import { getOrders } from "../../redux/actions/accountActions";
import { Bar } from 'react-chartjs-2'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchEngineerUpdate } from "../../redux/actions/managerTasksActions";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface Project {
  _id: string;
  projectName: string;
  manager: string;
  engineer: string;
  account: string;
  projectValue: number;
  bricks: number;
  steel: number;
  cement: number;
  coarseAggregate: number;
  fineAggregate: number;
  location: string;
}
type Order = {
  ManagerOrderid: string;
  projectName: string;
  bricks: number;
  steel: number;
  cement: number;
  coarseAggregate: number;
  fineAggregate: number;
};
mapboxgl.accessToken = 'pk.eyJ1IjoicmFteWFrYXJ1dGhhcHBhbmRpYW4iLCJhIjoiY200ZGY4YjVhMDAxODJtcG9uZjJyNTBqYyJ9.guAhHE6G0ZKf_--vddbBhw';

const OwnerLandingPage: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { project } = useSelector((state: RootState) => state.project);
  const { engineerUpdates } = useSelector((state: any) => state.managerTasks);
  const [recentProject, setRecentProject] = useState<Project | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const { orders } = useSelector(
    (state: RootState) => state.order
  );
  const [managerOrders, setManagerOrders] = useState<any[]>([]);
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);
  useEffect(() => {
    if (project && project.length > 0) {
      const mostRecentProject = project[project.length - 1]; 
      setRecentProject(mostRecentProject);
    }
    
  }, [project]);
console.log(engineerUpdates,"he");

  useEffect(() => {
    if (recentProject && recentProject.location) {
      console.log("Fetching geocode data for location:", recentProject.location);
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(recentProject.location)}.json?access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then(data => {
          console.log("Geocode response:", data);
          const coordinates = data.features[0]?.geometry.coordinates;
          if (coordinates) {
            setCoordinates(coordinates);
          }
        })
        .catch(error => {
          console.error("Error fetching geocode data:", error);
        });
    }
  }, [recentProject]);

  useEffect(() => {
    if (coordinates) {
      console.log("Initializing map at coordinates:", coordinates);
      const map = new mapboxgl.Map({
        container: 'map', 
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: coordinates, 
        zoom: 12, 
      });

      new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);
      return () => map.remove();
    }
  }, [coordinates]);

  useEffect(() => {
    setManagerOrders(orders);
  }, [orders]);

  useEffect(() => {
    dispatch(fetchEngineerUpdate());
  }, [dispatch]);
  const chartData = {
    labels: managerOrders.map(order => order.ManagerOrderid), 
    datasets: [
      {
        label: t("ownerLanding.Bricks"),
        data: managerOrders.map(order => order.bricks),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderWidth: 1
      },
      {
        label: t("ownerLanding.Cement"),
        data: managerOrders.map(order => order.cement),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderWidth: 1
      },
      {
        label: t("ownerLanding.CoarseAggregate"),
        data: managerOrders.map(order => order.coarseAggregate),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderWidth: 1
      },
      {
        label: t("ownerLanding.FineAggregate"),
        data: managerOrders.map(order => order.fineAggregate),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderWidth: 1
      },
      {
        label: t("ownerLanding.Steel"),
        data: managerOrders.map(order => order.steel),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderWidth: 1
      }
    ]
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: t("ownerLanding.materialUsed")
      }
    }
  };
  console.log(engineerUpdates);
  return (
    <div className="owner-landing-page">
      <h1>{t("ownerLanding.Dashboad")}</h1>
      <div className="content-container">
        <div className="map-container">
          <h2>{t("ownerLanding.recentLocation")}</h2>
          {coordinates ? (
            <div id="map" className="map-subcontainer"></div>
          ) : (
            <p>{t("ownerLanding.loading")}</p>
          )}
          <h1 className="location">{ recentProject ? recentProject.location: ""}</h1>
        </div>

        <div className="chart-container">
          <h2>{t("ownerLanding.graph")}</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default OwnerLandingPage;
