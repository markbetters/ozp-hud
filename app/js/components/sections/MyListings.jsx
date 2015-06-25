'use strict';

var Reflux = require('reflux');
var React = require('react');
var ChangeLog = require('./ChangeLog.jsx');
var ListingActions = require('../../actions/Listing');
var ProfileStore = require('../../store/Profile');
var ChangeLogStore = require('../../store/ProfileChangeLog');
var ListingManagementLink = require('../ListingManagementLink.jsx');

var MyListings = React.createClass({

    mixins: [
        Reflux.connect(ProfileStore, 'mylistings'),
        Reflux.connect(ChangeLogStore, 'mychangelogs')
    ],

    componentWillMount: function () {
        ListingActions.fetchOwnedChangeLogs();
        ListingActions.fetchOwnedListings();
    },

    getInitialState: function() {
        return {
            mylistings: [],
            mychangelogs: []
        };
    },
    
    renderChangeLogs: function () {
        if (!Array.isArray(this.state.mychangelogs)) {
            this.state.mychangelogs = [this.state.mychangelogs];
        }

        return this.state.mychangelogs.map(function (changeLog) {
            return [
                <ChangeLog showListingName={true} changeLog={changeLog}>
                    { changeLog.listing.iconUrl ? <img className="recent-activity-icon" src={ changeLog.listing.iconUrl } /> : <div></div> }
                </ChangeLog>,
                <br/>
            ];
        });       
    },

    renderCounts: function () {
        if (!Array.isArray(this.state.mylistings)) {
            this.state.mylistings = [this.state.mylistings];
        }

        var counts = this.state.mylistings.reduce(function (acc, i) {
            (acc[i.approvalStatus])++;
            return acc;
        }, {
            APPROVED: 0,
            APPROVED_ORG: 0,
            REJECTED: 0,
            PENDING: 0,
            IN_PROGRESS: 0
        });

        return (
            <div className="Listings__counts">
                <div className="MyListings__rejected">
                    <i className="icon-exclamation-36-redOrange"></i>
                    <span className="count">{counts.REJECTED}</span><br />
                    <span>Needs Action</span>
                </div>
                <div className="MyListings__approved">
                    <i className="icon-thumbs-up-36-green"></i>
                    <span className="count">{counts.APPROVED}</span><br />
                    <span>Approved</span>
                </div>
                <div className="MyListings__pending">
                    <i className="icon-loader-36-blue"></i>
                    <span className="count">{counts.APPROVED_ORG + counts.PENDING}</span><br />
                    <span>Pending</span>
                </div>
                <div className="MyListings__draft">
                    <i className="icon-paper-36-white"></i>
                    <span className="count">{counts.IN_PROGRESS}</span><br />
                    <span>Draft</span>
                </div>
            </div>
        );
    },

    render: function() {
        if (this.state.mylistings.length > 0) {
            return( 
                <div className="custom-hud-component" { ...this.props }>
                    <div className="Listings__bar">
                        <h1>My Listings</h1>
                        <ListingManagementLink>Listing Management <i className="icon-caret-right-blueDark"></i></ListingManagementLink>
                            { this.renderCounts() }
                    </div>
                    <div className="RecentActivity">
                        <h1>Recent Activity</h1>
                        <div className="RecentActivity__activities">
                            { this.renderChangeLogs() }
                        </div>
                    </div>
                    { this.props.children }
                </div>
            );
        } else {
            return(
                <div></div>
            );
        }
    }

});

module.exports = MyListings;