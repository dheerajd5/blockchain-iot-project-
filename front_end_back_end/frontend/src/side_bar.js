import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink,Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{   display: 'flex', height: '200vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
          Smart Vehicle
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/module1" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Vehicle Tracking and Monitoring</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/module2" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">Driver Behavior Analysis</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/module3" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">Vehicle Maintenance and Diagnostics</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/module4"  activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="th-large" style={{ whiteSpace: 'normal' }}>Fuel and Energy Efficiency  <br/>with Coolant vs Oil  <br /> Pressure Readings</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/module5" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="sticky-note">Asset and Inventory Management</CDBSidebarMenuItem>
            </NavLink>
          
          </CDBSidebarMenu>
        </CDBSidebarContent>

        
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;