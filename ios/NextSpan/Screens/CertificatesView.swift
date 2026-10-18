import SwiftUI

struct CertificatesView: View {
    @State private var page = 0
    @State private var zoom: String?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Picker("Certificate", selection: $page) {
                    Text("Rebate").tag(0)
                    Text("Carbon").tag(1)
                }
                .pickerStyle(.segmented)

                TabView(selection: $page) {
                    CertCard(
                        title: "Rebate certificate",
                        caption: "Paid to the developer when the buyer accepts."
                    ) {
                        Image("RebateCertificate").resizable().scaledToFit()
                    } onTap: { zoom = "rebate" }
                    .tag(0)

                    CertCard(
                        title: "Carbon certificate",
                        caption: "Embodied carbon kept in use \(DemoData.carbon), illustrative."
                    ) {
                        CarbonCertificate()
                    } onTap: { zoom = "carbon" }
                    .tag(1)
                }
                .tabViewStyle(.page(indexDisplayMode: .always))
                .indexViewStyle(.page(backgroundDisplayMode: .always))
                .frame(height: 360)

                Text("Generic framework. Not an official government certificate.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
            .padding(16)
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("Certificates")
        .navigationSubtitle("Developer and buyer")
        .fullScreenCover(item: $zoom) { which in
            if which == "rebate" {
                ImageViewer(image: "RebateCertificate", title: "Rebate certificate", band: .nsRebate)
            } else {
                CarbonZoom()
            }
        }
    }
}

extension String: @retroactive Identifiable { public var id: String { self } }

private struct CertCard<Content: View>: View {
    let title: String
    let caption: String
    @ViewBuilder let content: Content
    let onTap: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Button(action: onTap) {
                content
                    .overlay(Rectangle().stroke(Color(.separator), lineWidth: 1))
                    .overlay(alignment: .bottomTrailing) {
                        Image(systemName: "arrow.up.left.and.arrow.down.right")
                            .font(.footnote.weight(.semibold))
                            .padding(8)
                            .glassEffect()
                            .padding(8)
                    }
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Enlarge \(title)")
            Text(title).font(.headline)
            Text(caption).font(.subheadline).foregroundStyle(.secondary)
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 2)
    }
}

/// Drawn to match the rebate certificate: A4 landscape, colour panel left, record right.
/// Laid out at 842 × 595 and scaled to fit, so the proportions match the printed original.
struct CarbonCertificate: View {
    var body: some View {
        GeometryReader { geo in
            let k = geo.size.width / 842
            sheet
                .frame(width: 842, height: 595)
                .scaleEffect(k, anchor: .topLeading)
        }
        .aspectRatio(842 / 595, contentMode: .fit)
        .accessibilityElement()
        .accessibilityLabel("Carbon certificate. Embodied carbon kept in use \(DemoData.carbon), illustrative. Batch \(DemoData.batchID). Issued to developer and buyer.")
    }

    private var sheet: some View {
        HStack(spacing: 0) {
            VStack(alignment: .leading, spacing: 0) {
                Image("LogoReversed").resizable().frame(width: 30, height: 30)
                Spacer().frame(height: 90)
                Text("CARBON\nCERTIFICATE").font(.system(size: 26, weight: .bold))
                Spacer().frame(height: 70)
                Text("XXX").font(.system(size: 96, weight: .bold))
                Text("kg CO2e").font(.system(size: 34, weight: .bold))
                Text("Illustrative amount").font(.system(size: 14, weight: .bold)).padding(.top, 18)
                Spacer()
            }
            .foregroundStyle(.white)
            .padding(34)
            .frame(width: 340, height: 595, alignment: .topLeading)
            .background(Color.nsInkFixed)

            VStack(alignment: .leading, spacing: 0) {
                key("Batch")
                Text(DemoData.batchID).font(.system(size: 52, weight: .bold)).padding(.top, 4)
                HStack(alignment: .top, spacing: 16) {
                    VStack(alignment: .leading) { key("Accepted on delivery"); value("Date of acceptance (illustrative)") }
                    VStack(alignment: .leading) { key("Buyer"); value(DemoData.buyer) }
                }
                .padding(.top, 18)
                key("Members by grade").padding(.top, 18)
                VStack(alignment: .leading, spacing: 6) {
                    ForEach(Grade.allCases) { g in
                        HStack(spacing: 8) {
                            GradeBadge(grade: g, size: 24, decorative: true)
                            Rectangle().fill(g.color).frame(width: 300 * CGFloat(DemoData.count(g)) / 10, height: 16)
                        }
                    }
                }
                .padding(.top, 8)
                key("Embodied carbon kept in use").padding(.top, 18)
                HStack(alignment: .firstTextBaseline, spacing: 6) {
                    Text(DemoData.carbon).font(.system(size: 30, weight: .bold))
                    Text("(illustrative)").font(.system(size: 11)).foregroundStyle(Color.nsStone)
                }
                Spacer()
                Rectangle().fill(Color.nsInkFixed).frame(height: 2)
                Text("Issued to: Developer and buyer").font(.system(size: 15, weight: .bold)).padding(.top, 12)
                Text("Generic framework. Not an official government certificate.").font(.system(size: 8)).foregroundStyle(Color.nsStone).padding(.top, 10)
            }
            .foregroundStyle(Color.nsInkFixed)
            .padding(EdgeInsets(top: 44, leading: 44, bottom: 30, trailing: 44))
            .frame(width: 502, height: 595, alignment: .topLeading)
            .background(.white)
        }
    }

    private func key(_ s: String) -> some View {
        Text(s.uppercased()).font(.system(size: 9)).tracking(0.4).foregroundStyle(Color.nsStone)
    }
    private func value(_ s: String) -> some View {
        Text(s).font(.system(size: 13)).padding(.top, 4)
    }
}

private struct CarbonZoom: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView(.horizontal) {
                CarbonCertificate().frame(width: 760).padding(16)
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Carbon certificate")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) { Button("Close", systemImage: "xmark") { dismiss() } }
            }
        }
    }
}
