"use client"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

const Footer = () => {
    return (
        <footer className="bg-background text-foreground py-12">
            <div className="container mx-auto px-4">
                {/* Top Section: Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About Us */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About Us</h3>
                        <p className="text-sm text-muted-foreground">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-primary transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary transition">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-primary transition">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-primary transition">
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>
                                <MapPin className="inline-block mr-2" />
                                123 Main Street, City, Country
                            </p>
                            <p>
                                <Phone className="inline-block mr-2" />
                                +1 (234) 567-890
                            </p>
                            <p>
                                <Mail className="inline-block mr-2" />
                                support@myecommerce.com
                            </p>
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <Separator className="my-6" />

                {/* Bottom Section: Social Media & Copyright */}
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    {/* Social Media Icons */}
                    <div className="flex space-x-4">
                        <Button variant="ghost" size="icon">
                            <Facebook className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Instagram className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Twitter className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} MyEcommerce. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer

